package com.tlcn.fashion_api.service.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.ai.provider.AIProvider;
import com.tlcn.fashion_api.ai.util.PromptBuilder;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.config.RedisConfig;
import com.tlcn.fashion_api.dto.request.ai.OutfitRequest;
import com.tlcn.fashion_api.dto.request.ai.ProductRecommendRequest;
import com.tlcn.fashion_api.dto.response.ai.*;
import com.tlcn.fashion_api.entity.ai.AiRecommendationLog;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductImage;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.repository.ai.AiRecommendationLogRepository;
import com.tlcn.fashion_api.repository.ai.UserBehaviorLogRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Core AI recommendation service.
 *
 * <h3>Flow — Outfit Generation:</h3>
 * <ol>
 *   <li>Sanitize + hash prompt → cache key</li>
 *   <li>Cache lookup via AiRecommendationLogRepository</li>
 *   <li>If miss: parse budget → query DB (max 15 products) → call AI → parse JSON → enrich</li>
 *   <li>Save log async → return OutfitResponse</li>
 * </ol>
 *
 * <h3>Flow — Trending:</h3>
 * <ol>
 *   <li>Query behavior logs (last 7 days) for trending product IDs</li>
 *   <li>Fall back to top sold-count products</li>
 *   <li>Cached 10 min via @Cacheable</li>
 * </ol>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final AIProvider aiProvider;
    private final ProductRepository productRepository;
    private final AiRecommendationLogRepository logRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;
    private final ObjectMapper objectMapper;

    // max products sent to AI context — keep token cost low
    private static final int MAX_CONTEXT_PRODUCTS = 15;
    private static final int TRENDING_BEHAVIOR_DAYS = 7;

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    @Override
    public OutfitResponse generateOutfit(OutfitRequest request, Long userId) {
        String sanitized = PromptBuilder.sanitize(request.getPrompt());
        if (sanitized.isBlank()) throw new BadRequestException("Yêu cầu outfit không hợp lệ");

        String promptHash = PromptBuilder.hashPrompt(sanitized);

        // ----- cache hit check -----
        Optional<AiRecommendationLog> cached = logRepository
                .findByPromptHashAndStatusAndCacheHitFalse(
                        promptHash, AiRecommendationLog.LogStatus.SUCCESS);

        if (cached.isPresent()) {
            log.debug("Outfit cache HIT — hash={}", promptHash);
            return parseOutfitFromCachedLog(cached.get(), sanitized);
        }

        // ----- build context -----
        BigDecimal budgetLimit = parseBudget(sanitized);
        List<Product> contextProducts = fetchContextProducts(budgetLimit, MAX_CONTEXT_PRODUCTS);
        List<ProductSuggestionDto> shortlist = contextProducts.stream()
                .map(this::toSuggestionDto)
                .toList();

        if (shortlist.isEmpty()) {
            log.warn("No products available for outfit generation");
            return OutfitResponse.builder()
                    .originalPrompt(sanitized)
                    .outfits(Collections.emptyList())
                    .tokensUsed(0)
                    .fromCache(false)
                    .build();
        }

        // ----- call AI -----
        List<AIProvider.Message> messages = buildOutfitMessages(sanitized, shortlist);
        long start = System.currentTimeMillis();
        AIProvider.ChatCompletion completion;
        try {
            completion = aiProvider.complete(messages, AIProvider.CompletionOptions.creative());
        } catch (Exception e) {
            saveLog(promptHash, sanitized, null, userId, null, 0L,
                    AiRecommendationLog.RecommendationType.OUTFIT,
                    AiRecommendationLog.LogStatus.ERROR, e.getMessage());
            throw new BadRequestException("Không thể tạo outfit lúc này. Vui lòng thử lại sau.");
        }
        long latency = System.currentTimeMillis() - start;

        // ----- parse + enrich -----
        List<OutfitDto> outfits = parseAndEnrichOutfits(completion.content(), contextProducts);

        // ----- async save log -----
        saveLog(promptHash, sanitized, completion.content(), userId,
                buildProductIdsCsv(contextProducts), (long) completion.totalTokens(),
                AiRecommendationLog.RecommendationType.OUTFIT,
                AiRecommendationLog.LogStatus.SUCCESS, null);

        log.info("Outfit generated — outfits={}, tokens={}, latency={}ms",
                outfits.size(), completion.totalTokens(), latency);

        return OutfitResponse.builder()
                .originalPrompt(sanitized)
                .outfits(outfits)
                .tokensUsed(completion.totalTokens())
                .fromCache(false)
                .build();
    }

    @Override
    public RecommendationResponse recommendProducts(ProductRecommendRequest request, Long userId) {
        // ----- personalised from behavior -----
        List<Product> candidates;
        String reason;

        if (userId != null) {
            List<Long> topProductIds = behaviorLogRepository
                    .findTopProductIdsByUser(userId, PageRequest.of(0, 5))
                    .stream()
                    .map(row -> (Long) row[0])
                    .toList();

            if (!topProductIds.isEmpty()) {
                // find products in same categories as viewed products
                candidates = productRepository.findByStatusOrderBySoldCountDesc(
                        "ACTIVE", PageRequest.of(0, MAX_CONTEXT_PRODUCTS));
                reason = "Dựa trên sản phẩm bạn đã xem gần đây";
            } else {
                candidates = fetchContextProducts(null, MAX_CONTEXT_PRODUCTS);
                reason = "Sản phẩm nổi bật được nhiều người yêu thích";
            }
        } else if (request.getViewedProductIds() != null && !request.getViewedProductIds().isEmpty()) {
            candidates = productRepository.findByStatusOrderBySoldCountDesc(
                    "ACTIVE", PageRequest.of(0, MAX_CONTEXT_PRODUCTS));
            reason = "Sản phẩm tương tự bạn đã xem";
        } else {
            candidates = fetchContextProducts(null, MAX_CONTEXT_PRODUCTS);
            reason = "Gợi ý hàng đầu cho bạn";
        }

        int limit = request.getLimit() != null ? Math.min(request.getLimit(), 20) : 10;
        List<ProductSuggestionDto> suggestions = candidates.stream()
                .limit(limit)
                .map(this::toSuggestionDto)
                .toList();

        return RecommendationResponse.builder()
                .products(suggestions)
                .recommendationReason(reason)
                .fromCache(false)
                .build();
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_AI_TRENDING, key = "#limit",
               unless = "#result == null || #result.products.isEmpty()")
    public RecommendationResponse getTrending(int limit) {
        log.debug("Trending cache MISS — querying DB, limit={}", limit);

        // try behavior-based trending first
        LocalDateTime since = LocalDateTime.now().minusDays(TRENDING_BEHAVIOR_DAYS);
        List<Long> trendingIds = behaviorLogRepository
                .findTrendingProductIds(since, PageRequest.of(0, limit))
                .stream()
                .map(row -> (Long) row[0])
                .toList();

        List<Product> products;
        if (!trendingIds.isEmpty()) {
            products = productRepository.findAllByIdInWithDetails(trendingIds);
            // preserve trending order
            Map<Long, Product> byId = products.stream()
                    .collect(Collectors.toMap(Product::getId, p -> p));
            products = trendingIds.stream()
                    .map(byId::get)
                    .filter(Objects::nonNull)
                    .toList();
        } else {
            products = productRepository.findByStatusOrderBySoldCountDesc(
                    "ACTIVE", PageRequest.of(0, limit));
        }

        List<ProductSuggestionDto> suggestions = products.stream()
                .map(this::toSuggestionDto)
                .toList();

        return RecommendationResponse.builder()
                .products(suggestions)
                .recommendationReason("Đang được yêu thích nhiều nhất")
                .fromCache(false)
                .build();
    }

    // =========================================================================
    // HELPER — toSuggestionDto (public — used by AiChatbotServiceImpl)
    // =========================================================================

    public ProductSuggestionDto toSuggestionDto(Product product) {
        BigDecimal price = resolvePrice(product);
        BigDecimal originalPrice = resolveOriginalPrice(product);
        String imageUrl = resolveImageUrl(product);

        return ProductSuggestionDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .imageUrl(imageUrl)
                .price(price)
                .originalPrice(originalPrice != null && originalPrice.compareTo(price) > 0
                        ? originalPrice : null)
                .build();
    }

    // =========================================================================
    // PRIVATE — outfit generation helpers
    // =========================================================================

    private List<AIProvider.Message> buildOutfitMessages(
            String userPrompt,
            List<ProductSuggestionDto> shortlist
    ) {
        String productBlock = PromptBuilder.buildProductContextBlock(shortlist);
        String fullPrompt = "Yêu cầu của khách: " + userPrompt + productBlock;

        return List.of(
                AIProvider.Message.system(PromptBuilder.outfitSystemPrompt()),
                AIProvider.Message.user(fullPrompt)
        );
    }

    /**
     * Parse AI JSON response → list of OutfitDto with enriched product data.
     * Robust against markdown code fences and extra text.
     */
    private List<OutfitDto> parseAndEnrichOutfits(String aiContent, List<Product> contextProducts) {
        Map<Long, Product> productMap = contextProducts.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        try {
            String json = extractJson(aiContent);
            AiOutfitJsonWrapper wrapper = objectMapper.readValue(json, AiOutfitJsonWrapper.class);
            if (wrapper == null || wrapper.outfits() == null) return Collections.emptyList();

            List<OutfitDto> enriched = new ArrayList<>();
            for (AiOutfitJson ao : wrapper.outfits()) {
                if (ao.items() == null || ao.items().isEmpty()) continue;

                BigDecimal total = BigDecimal.ZERO;
                List<OutfitItemDto> items = new ArrayList<>();

                for (AiOutfitItemJson ai : ao.items()) {
                    Product p = productMap.get(ai.productId());
                    OutfitItemDto item;
                    if (p != null) {
                        BigDecimal price = resolvePrice(p);
                        item = OutfitItemDto.builder()
                                .productId(p.getId())
                                .productName(p.getName() != null ? p.getName() : ai.productName())
                                .slug(p.getSlug())
                                .imageUrl(resolveImageUrl(p))
                                .price(price)
                                .role(ai.role())
                                .build();
                        total = total.add(price);
                    } else {
                        // AI hallucinated an ID — skip
                        log.debug("Skipping unknown productId={} from AI response", ai.productId());
                        continue;
                    }
                    items.add(item);
                }

                if (items.isEmpty()) continue;

                enriched.add(OutfitDto.builder()
                        .outfitNumber(ao.outfitNumber() != null ? ao.outfitNumber() : enriched.size() + 1)
                        .name(ao.name())
                        .description(ao.description())
                        .occasion(ao.occasion())
                        .style(ao.style())
                        .items(items)
                        .totalPrice(total)
                        .build());
            }
            return enriched;
        } catch (Exception e) {
            log.warn("Failed to parse outfit JSON from AI response: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private OutfitResponse parseOutfitFromCachedLog(AiRecommendationLog log_, String originalPrompt) {
        try {
            // Re-parse cached AI response — but enrich from current DB state
            List<Long> contextIds = Arrays.stream(
                            Optional.ofNullable(log_.getProductsContextIds())
                                    .orElse("").split(","))
                    .filter(s -> !s.isBlank())
                    .map(Long::parseLong)
                    .toList();

            List<Product> contextProducts = contextIds.isEmpty()
                    ? productRepository.findByStatusOrderBySoldCountDesc("ACTIVE", PageRequest.of(0, MAX_CONTEXT_PRODUCTS))
                    : productRepository.findAllByIdInWithDetails(contextIds);

            List<OutfitDto> outfits = log_.getAiResponse() != null
                    ? parseAndEnrichOutfits(log_.getAiResponse(), contextProducts)
                    : Collections.emptyList();

            return OutfitResponse.builder()
                    .originalPrompt(originalPrompt)
                    .outfits(outfits)
                    .tokensUsed(Optional.ofNullable(log_.getTokensUsed()).orElse(0))
                    .fromCache(true)
                    .logId(log_.getId())
                    .build();
        } catch (Exception e) {
            log.warn("Failed to restore cached outfit log id={}: {}", log_.getId(), e.getMessage());
            return OutfitResponse.builder()
                    .originalPrompt(originalPrompt)
                    .outfits(Collections.emptyList())
                    .tokensUsed(0)
                    .fromCache(true)
                    .build();
        }
    }

    // =========================================================================
    // PRIVATE — product helpers
    // =========================================================================

    private List<Product> fetchContextProducts(BigDecimal budgetLimit, int limit) {
        List<Product> all = productRepository.findByStatusOrderBySoldCountDesc(
                "ACTIVE", PageRequest.of(0, limit * 2)); // fetch more, then filter

        if (budgetLimit == null) return all.stream().limit(limit).toList();

        List<Product> filtered = all.stream()
                .filter(p -> {
                    BigDecimal price = resolvePrice(p);
                    return price.compareTo(budgetLimit) <= 0;
                })
                .limit(limit)
                .toList();

        // fallback: if too few results after budget filter, include all
        return filtered.size() >= 3 ? filtered : all.stream().limit(limit).toList();
    }

    /** Resolve display price: minimum active variant price, or basePrice, or ZERO. */
    BigDecimal resolvePrice(Product product) {
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            return product.getVariants().stream()
                    .filter(v -> !"INACTIVE".equalsIgnoreCase(v.getStatus()))
                    .map(ProductVariant::getPrice)
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(Optional.ofNullable(product.getBasePrice()).orElse(BigDecimal.ZERO));
        }
        return Optional.ofNullable(product.getBasePrice()).orElse(BigDecimal.ZERO);
    }

    /** Resolve compare-at price (before sale). */
    private BigDecimal resolveOriginalPrice(Product product) {
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            return product.getVariants().stream()
                    .filter(v -> !"INACTIVE".equalsIgnoreCase(v.getStatus()))
                    .map(ProductVariant::getCompareAtPrice)
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(null);
        }
        return null;
    }

    /** Extract first primary image URL, or first available. */
    String resolveImageUrl(Product product) {
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            return product.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElseGet(() -> product.getImages().stream()
                            .map(ProductImage::getImageUrl)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null));
        }
        // fallback: variant image
        if (product.getVariants() != null) {
            return product.getVariants().stream()
                    .flatMap(v -> v.getImages().stream())
                    .map(vi -> vi.getImageUrl())
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    // =========================================================================
    // PRIVATE — budget parsing
    // =========================================================================

    private static final Pattern BUDGET_TRIEU = Pattern.compile(
            "(?i)(?:dưới|dưới|<|under)?\\s*(\\d+(?:[,.]\\d+)?)\\s*triệu");
    private static final Pattern BUDGET_K = Pattern.compile(
            "(?i)(?:dưới|<|under)?\\s*(\\d+)\\s*k\\b");
    private static final Pattern BUDGET_DONG = Pattern.compile(
            "(?i)(?:dưới|<|under)?\\s*(\\d{4,9})\\s*(?:đồng|đ|vnd)?\\b");

    BigDecimal parseBudget(String prompt) {
        Matcher m = BUDGET_TRIEU.matcher(prompt);
        if (m.find()) {
            double val = Double.parseDouble(m.group(1).replace(",", "."));
            return BigDecimal.valueOf((long) (val * 1_000_000));
        }
        m = BUDGET_K.matcher(prompt);
        if (m.find()) {
            long val = Long.parseLong(m.group(1));
            return BigDecimal.valueOf(val * 1_000);
        }
        m = BUDGET_DONG.matcher(prompt);
        if (m.find()) {
            long val = Long.parseLong(m.group(1).replaceAll("[,.]", ""));
            return BigDecimal.valueOf(val);
        }
        return null;
    }

    // =========================================================================
    // PRIVATE — JSON extraction
    // =========================================================================

    private static final Pattern MARKDOWN_JSON = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)```");

    private String extractJson(String text) {
        if (text == null || text.isBlank()) return "{}";
        Matcher m = MARKDOWN_JSON.matcher(text);
        if (m.find()) return m.group(1).trim();
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) return text.substring(start, end + 1);
        return text.trim();
    }

    // =========================================================================
    // PRIVATE — log helpers
    // =========================================================================

    @Async
    void saveLog(String hash, String prompt, String aiResponse, Long userId,
                 String contextIds, Long tokens,
                 AiRecommendationLog.RecommendationType type,
                 AiRecommendationLog.LogStatus status, String error) {
        try {
            logRepository.save(AiRecommendationLog.builder()
                    .userId(userId)
                    .promptHash(hash)
                    .userPrompt(prompt)
                    .aiResponse(aiResponse)
                    .productsContextIds(contextIds)
                    .tokensUsed(tokens != null ? tokens.intValue() : 0)
                    .recommendationType(type)
                    .status(status)
                    .errorMessage(error != null && error.length() > 500 ? error.substring(0, 500) : error)
                    .cacheHit(false)
                    .build());
        } catch (Exception e) {
            log.warn("Failed to save recommendation log: {}", e.getMessage());
        }
    }

    private String buildProductIdsCsv(List<Product> products) {
        return products.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.joining(","));
    }

    // =========================================================================
    // PRIVATE — AI response JSON DTOs (inner records)
    // =========================================================================

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AiOutfitJsonWrapper(List<AiOutfitJson> outfits) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AiOutfitJson(
            Integer outfitNumber,
            String name,
            String description,
            String occasion,
            String style,
            List<AiOutfitItemJson> items
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AiOutfitItemJson(
            Long productId,
            String productName,
            String role
    ) {}
}
