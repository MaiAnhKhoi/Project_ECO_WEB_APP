package com.tlcn.fashion_api.service.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.dto.response.ai.ProductSuggestionDto;
import com.tlcn.fashion_api.dto.response.ai.StyleAnalysisResponse;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductCategory;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.entity.product.Stock;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Phân tích style theo từng lần upload — <strong>không cache</strong> theo user hay hash ảnh.
 * Lịch sử lưu bảng {@code style_analysis_history} (async).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StyleAnalysisServiceImpl implements StyleAnalysisService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final int PRODUCT_LIMIT = 12;
    private static final int CANDIDATE_ID_PAGE = 400;
    private static final String PRODUCT_STATUS_ACTIVE = "active";
    private static final double GENDER_CONFIRM_THRESHOLD = 0.60;

    private static final List<String> MALE_KEYWORDS = List.of(
            " nam", "nam ", "nam,", "(nam)", "men", "male", "boy", "bộ suit", "áo sơ mi nam",
            "quần nam", "áo polo", "áo thun nam", "áo khoác nam"
    );
    private static final List<String> FEMALE_KEYWORDS = List.of(
            " nữ", "nữ ", "nữ,", "(nữ)", "women", "female", "girl", "váy", "đầm", "chân váy",
            "áo nữ", "quần nữ", "blouse", "crop top", "áo babydoll"
    );

    private final CloudinaryService cloudinaryService;
    private final StyleVisionClient visionClient;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final StyleAnalysisHistoryWriter historyWriter;
    private final RecommendationServiceImpl recommendationService;

    @Override
    public StyleAnalysisResponse analyze(MultipartFile image, Long userId) {
        validateImage(image);

        String imageUrl = uploadImage(image);
        String rawJson = visionClient.analyzeImage(imageUrl);
        VisionResult result = parseVisionResult(rawJson);

        List<ProductSuggestionDto> products = recommendProducts(result);

        boolean needsConfirmation = "UNKNOWN".equalsIgnoreCase(result.gender())
                && result.genderConfidence() < GENDER_CONFIRM_THRESHOLD;

        StyleAnalysisResponse response = StyleAnalysisResponse.builder()
                .gender(result.gender())
                .bodyType(result.bodyType())
                .skinTone(result.skinTone())
                .recommendedStyle(result.recommendedStyle())
                .confidenceScore(result.confidence())
                .analyzedImageUrl(imageUrl)
                .needsGenderConfirmation(needsConfirmation)
                .products(products)
                .fromCache(false)
                .profileId(null)
                .build();

        if (userId != null) {
            try {
                String historyPayload = objectMapper.writeValueAsString(response);
                historyWriter.saveAsync(userId, imageUrl, result.bodyType(), result.skinTone(),
                        result.recommendedStyle(), historyPayload);
            } catch (JsonProcessingException e) {
                log.warn("[StyleAnalysis] Cannot serialize history JSON: {}", e.getMessage());
            }
        }

        return response;
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn ảnh để phân tích.");
        }
        if (image.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Ảnh quá lớn. Kích thước tối đa là 5MB.");
        }
        String contentType = image.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPEG, PNG, WebP.");
        }
        String filename = image.getOriginalFilename();
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (!Set.of("jpg", "jpeg", "png", "webp").contains(ext)) {
                throw new BadRequestException("Phần mở rộng file không hợp lệ.");
            }
        }
    }

    private String uploadImage(MultipartFile image) {
        try {
            String url = cloudinaryService.uploadFile(image, "ai-style-analysis");
            if (!StringUtils.hasText(url)) {
                throw new BadRequestException("Không thể tải ảnh lên. Vui lòng thử lại.");
            }
            return url;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("[StyleAnalysis] Upload thất bại: {}", e.getMessage(), e);
            throw new BadRequestException("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
        }
    }

    private VisionResult parseVisionResult(String rawJson) {
        try {
            VisionResultRaw raw = objectMapper.readValue(rawJson, VisionResultRaw.class);
            String gender = normalizeGender(raw.gender());
            double genderConf = clamp(raw.genderConfidence());
            return new VisionResult(
                    gender,
                    genderConf,
                    sanitize(raw.bodyType(), "Athletic"),
                    sanitize(raw.skinTone(), "Medium"),
                    sanitize(raw.recommendedStyle(), "Casual"),
                    raw.styleKeywords() != null ? raw.styleKeywords() : List.of(),
                    clamp(raw.confidence())
            );
        } catch (JsonProcessingException e) {
            log.warn("[StyleAnalysis] JSON parse failed: {} — dùng fallback", e.getMessage());
            return new VisionResult("UNKNOWN", 0.0, "Athletic", "Medium", "Casual", List.of(), 0.5);
        }
    }

    private static String normalizeGender(String raw) {
        if (!StringUtils.hasText(raw)) return "UNKNOWN";
        return switch (raw.trim().toUpperCase()) {
            case "MALE", "NAM", "MAN", "MEN", "BOY" -> "MALE";
            case "FEMALE", "NỮ", "NU", "WOMAN", "WOMEN", "GIRL" -> "FEMALE";
            case "UNISEX" -> "UNISEX";
            default -> "UNKNOWN";
        };
    }

    private static String sanitize(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }

    private static double clamp(Double raw) {
        if (raw == null) return 0.5;
        return Math.max(0.0, Math.min(1.0, raw));
    }

    // =========================================================================
    // PRODUCT RECOMMENDATION — in-stock, gender, style, category fallback
    // =========================================================================

    private List<ProductSuggestionDto> recommendProducts(VisionResult result) {
        try {
            List<Long> idOrder = productRepository.findIdsByStatusOrderBySoldCountDesc(
                    PRODUCT_STATUS_ACTIVE, PageRequest.of(0, CANDIDATE_ID_PAGE));
            if (idOrder.isEmpty()) return List.of();

            List<Product> pool = loadProductsPreservingOrder(idOrder);
            if (pool.isEmpty()) return List.of();

            List<Product> inStock = pool.stream()
                    .filter(this::hasSellableStock)
                    .toList();
            if (inStock.isEmpty()) return List.of();

            List<String> styleKws = buildStyleKeywords(result);
            String gender = result.gender();

            LinkedHashSet<Long> picked = new LinkedHashSet<>();
            List<Product> ordered = new ArrayList<>();

            // 1) gender + style
            appendTier(inStock, p -> matchesGender(p, gender) && matchesStyle(p, styleKws), ordered, picked);
            // 2) gender only
            if (ordered.size() < PRODUCT_LIMIT) {
                appendTier(inStock, p -> matchesGender(p, gender) && !picked.contains(p.getId()), ordered, picked);
            }
            // 3) style only (mọi giới)
            if (ordered.size() < PRODUCT_LIMIT) {
                appendTier(inStock, p -> matchesStyle(p, styleKws) && !picked.contains(p.getId()), ordered, picked);
            }
            // 4) cùng category với tier đã match style (hoặc gender)
            if (ordered.size() < PRODUCT_LIMIT) {
                Set<Long> fromStyleOrGender = collectCategoryIdsFrom(inStock, p ->
                        matchesGender(p, gender) && (matchesStyle(p, styleKws) || styleKws.isEmpty()));
                final Set<Long> catIds;
                if (fromStyleOrGender.isEmpty()) {
                    catIds = collectCategoryIdsFrom(inStock, p -> matchesGender(p, gender));
                } else {
                    catIds = fromStyleOrGender;
                }
                if (!catIds.isEmpty()) {
                    List<Product> byCat = inStock.stream()
                            .filter(p -> !picked.contains(p.getId()))
                            .filter(p -> inAnyCategory(p, catIds))
                            .sorted(Comparator.<Product>comparingInt(
                                    p -> Optional.ofNullable(p.getSoldCount()).orElse(0)).reversed())
                            .toList();
                    for (Product p : byCat) {
                        if (ordered.size() >= PRODUCT_LIMIT) break;
                        if (picked.add(p.getId())) ordered.add(p);
                    }
                }
            }
            // 5) trending có tồn — luôn có gợi ý nếu kho có hàng
            if (ordered.size() < PRODUCT_LIMIT) {
                for (Product p : inStock) {
                    if (ordered.size() >= PRODUCT_LIMIT) break;
                    if (picked.add(p.getId())) ordered.add(p);
                }
            }

            return ordered.stream()
                    .limit(PRODUCT_LIMIT)
                    .map(p -> withReason(recommendationService.toSuggestionDto(p), result.recommendedStyle()))
                    .toList();

        } catch (Exception e) {
            log.warn("[StyleAnalysis] Lỗi recommend products: {}", e.getMessage());
            return List.of();
        }
    }

    private List<Product> loadProductsPreservingOrder(List<Long> idOrder) {
        if (idOrder.isEmpty()) return List.of();
        List<Product> loaded = productRepository.findByIdInWithStyleRecommendationGraph(idOrder);
        Map<Long, Product> byId = loaded.stream().collect(Collectors.toMap(Product::getId, p -> p, (a, b) -> a));
        List<Product> out = new ArrayList<>(idOrder.size());
        for (Long id : idOrder) {
            Product p = byId.get(id);
            if (p != null) out.add(p);
        }
        return out;
    }

    private static void appendTier(List<Product> pool, java.util.function.Predicate<Product> pred,
                                   List<Product> out, Set<Long> picked) {
        List<Product> tier = pool.stream()
                .filter(pred)
                .filter(p -> !picked.contains(p.getId()))
                .sorted(Comparator.<Product>comparingInt(
                        p -> Optional.ofNullable(p.getSoldCount()).orElse(0)).reversed())
                .toList();
        for (Product p : tier) {
            if (out.size() >= PRODUCT_LIMIT) break;
            if (picked.add(p.getId())) out.add(p);
        }
    }

    private boolean hasSellableStock(Product product) {
        if (product.getVariants() == null) return false;
        for (ProductVariant v : product.getVariants()) {
            if (v.getStatus() != null && "INACTIVE".equalsIgnoreCase(v.getStatus())) continue;
            if (v.getStocks() == null) continue;
            for (Stock s : v.getStocks()) {
                if (s.getQuantity() != null && s.getQuantity() > 0) return true;
            }
        }
        return false;
    }

    private boolean matchesGender(Product product, String gender) {
        if ("UNISEX".equals(gender) || "UNKNOWN".equals(gender)) return true;
        String text = ((product.getName() != null ? product.getName() : "")
                + " " + (product.getTags() != null ? product.getTags() : ""))
                .toLowerCase();
        if ("MALE".equals(gender)) {
            return FEMALE_KEYWORDS.stream().noneMatch(text::contains);
        }
        if ("FEMALE".equals(gender)) {
            return MALE_KEYWORDS.stream().noneMatch(text::contains);
        }
        return true;
    }

    private List<String> buildStyleKeywords(VisionResult result) {
        List<String> keywords = new ArrayList<>(result.styleKeywords());
        String style = result.recommendedStyle().toLowerCase();
        if (style.contains("casual")) keywords.addAll(List.of("casual", "basic", "everyday"));
        if (style.contains("formal")) keywords.addAll(List.of("formal", "suit", "dress shirt"));
        if (style.contains("sport")) keywords.addAll(List.of("sport", "active", "gym", "thể thao"));
        if (style.contains("streetwear")) keywords.addAll(List.of("street", "hoodie", "sneaker"));
        if (style.contains("business")) keywords.addAll(List.of("office", "business", "shirt"));
        if (style.contains("bohemian")) keywords.addAll(List.of("floral", "boho", "flowy"));
        if (style.contains("minimal")) keywords.addAll(List.of("minimal", "clean", "simple", "basic"));
        return keywords;
    }

    private boolean matchesStyle(Product product, List<String> keywords) {
        if (keywords.isEmpty()) return true;
        String text = ((product.getName() != null ? product.getName() : "")
                + " " + (product.getTags() != null ? product.getTags() : "")
                + " " + (product.getDescription() != null ? product.getDescription() : ""))
                .toLowerCase();
        return keywords.stream().anyMatch(kw -> text.contains(kw.toLowerCase()));
    }

    private static Set<Long> collectCategoryIdsFrom(List<Product> pool, java.util.function.Predicate<Product> pred) {
        Set<Long> ids = new HashSet<>();
        for (Product p : pool) {
            if (!pred.test(p)) continue;
            if (p.getProductCategories() == null) continue;
            for (ProductCategory pc : p.getProductCategories()) {
                Long cid = pc.getCategoryId();
                if (cid != null) ids.add(cid);
            }
        }
        return ids;
    }

    private static boolean inAnyCategory(Product p, Set<Long> catIds) {
        if (p.getProductCategories() == null) return false;
        for (ProductCategory pc : p.getProductCategories()) {
            if (pc.getCategoryId() != null && catIds.contains(pc.getCategoryId())) return true;
        }
        return false;
    }

    private static ProductSuggestionDto withReason(ProductSuggestionDto dto, String style) {
        dto.setReason("Phù hợp với phong cách " + style);
        return dto;
    }

    private record VisionResult(
            String gender,
            double genderConfidence,
            String bodyType,
            String skinTone,
            String recommendedStyle,
            List<String> styleKeywords,
            double confidence
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VisionResultRaw(
            String gender,
            Double genderConfidence,
            String bodyType,
            String skinTone,
            String recommendedStyle,
            List<String> styleKeywords,
            Double confidence,
            String notes
    ) {}
}
