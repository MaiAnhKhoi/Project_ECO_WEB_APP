package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.ai.provider.AIProvider;
import com.tlcn.fashion_api.ai.util.PromptBuilder;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.dto.request.ai.ChatRequest;
import com.tlcn.fashion_api.dto.response.ai.*;
import com.tlcn.fashion_api.entity.ai.AiChatConversation;
import com.tlcn.fashion_api.entity.ai.AiChatMessage;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.repository.ai.AiChatConversationRepository;
import com.tlcn.fashion_api.repository.ai.AiChatMessageRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiChatbotServiceImpl implements AiChatbotService {

    private final AIProvider aiProvider;
    private final AiChatConversationRepository conversationRepository;
    private final AiChatMessageRepository messageRepository;
    private final ProductRepository productRepository;
    private final RecommendationServiceImpl recommendationService;

    @Value("${ai.chatbot.system-prompt:}")
    private String systemPromptConfig;

    @Value("${ai.chatbot.max-history-messages:10}")
    private int maxHistoryMessages;

    private static final Pattern PRODUCT_QUERY_PATTERN =
            Pattern.compile("(?i)(áo|quần|giày|váy|đầm|túi|phụ kiện|outfit|bộ|set|áo khoác|áo sơ mi|t-shirt|polo)");
    private static final Pattern ORDER_QUERY_PATTERN =
            Pattern.compile("(?i)(đơn hàng|order|theo dõi|trạng thái|vận chuyển|giao hàng|hoàn tiền|đổi trả)");

    // -------------------------------------------------------------------------
    // MAIN CHAT
    // -------------------------------------------------------------------------

    @Override
    @Transactional
    public ChatResponse chat(ChatRequest request, Long userId) {
        String sanitizedMessage = PromptBuilder.sanitize(request.getMessage());
        if (sanitizedMessage.isBlank()) {
            throw new BadRequestException("Tin nhắn không hợp lệ");
        }

        AiChatConversation conversation = resolveConversation(request, userId);
        List<AiChatMessage> history = messageRepository.findRecentMessages(
                conversation.getId(), PageRequest.of(0, maxHistoryMessages));
        Collections.reverse(history);

        List<AIProvider.Message> messages = buildMessageChain(sanitizedMessage, history);
        enrichWithProductContext(messages, sanitizedMessage);

        long start = System.currentTimeMillis();
        AIProvider.ChatCompletion completion = aiProvider.complete(messages, AIProvider.CompletionOptions.defaults());
        long latency = System.currentTimeMillis() - start;

        saveMessages(conversation, sanitizedMessage, completion, latency);
        updateConversationTitle(conversation, sanitizedMessage);

        List<ProductSuggestionDto> suggestedProducts = extractProductSuggestions(
                completion.content(), sanitizedMessage);

        return ChatResponse.builder()
                .conversationId(conversation.getId())
                .sessionId(conversation.getSessionId())
                .reply(completion.content())
                .suggestedProducts(suggestedProducts)
                .tokensUsed(completion.totalTokens())
                .fromCache(false)
                .build();
    }

    // -------------------------------------------------------------------------
    // HISTORY
    // -------------------------------------------------------------------------

    @Override
    public Page<ConversationHistoryDto> getChatHistory(Long userId, Pageable pageable) {
        Page<AiChatConversation> page = conversationRepository
                .findByUserIdAndStatusOrderByUpdatedAtDesc(
                        userId, AiChatConversation.ConversationStatus.ACTIVE, pageable);

        List<ConversationHistoryDto> dtos = page.getContent().stream()
                .map(conv -> ConversationHistoryDto.builder()
                        .conversationId(conv.getId())
                        .sessionId(conv.getSessionId())
                        .title(conv.getTitle())
                        .createdAt(conv.getCreatedAt())
                        .updatedAt(conv.getUpdatedAt())
                        .messages(Collections.emptyList())
                        .build())
                .toList();

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Override
    public ConversationHistoryDto getConversation(Long conversationId, Long userId) {
        AiChatConversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuộc hội thoại không tồn tại"));

        if (userId != null && conv.getUserId() != null && !conv.getUserId().equals(userId)) {
            throw new BadRequestException("Không có quyền truy cập cuộc hội thoại này");
        }

        List<AiChatMessage> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        return ConversationHistoryDto.builder()
                .conversationId(conv.getId())
                .sessionId(conv.getSessionId())
                .title(conv.getTitle())
                .messages(msgs.stream().map(ChatMessageDto::from).toList())
                .createdAt(conv.getCreatedAt())
                .updatedAt(conv.getUpdatedAt())
                .build();
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private AiChatConversation resolveConversation(ChatRequest request, Long userId) {
        if (request.getConversationId() != null) {
            return conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cuộc hội thoại không tồn tại"));
        }

        String sessionId = resolveSessionId(request.getSessionId());

        return conversationRepository
                .findBySessionIdAndStatus(sessionId, AiChatConversation.ConversationStatus.ACTIVE)
                .orElseGet(() -> conversationRepository.save(
                        AiChatConversation.builder()
                                .userId(userId)
                                .sessionId(sessionId)
                                .status(AiChatConversation.ConversationStatus.ACTIVE)
                                .build()
                ));
    }

    private String resolveSessionId(String provided) {
        return (provided != null && !provided.isBlank()) ? provided : UUID.randomUUID().toString();
    }

    private List<AIProvider.Message> buildMessageChain(String userMessage, List<AiChatMessage> history) {
        List<AIProvider.Message> messages = new ArrayList<>();
        messages.add(AIProvider.Message.system(PromptBuilder.chatSystemPrompt(systemPromptConfig)));

        for (AiChatMessage h : history) {
            if (h.getRole() == AiChatMessage.MessageRole.USER) {
                messages.add(AIProvider.Message.user(h.getContent()));
            } else if (h.getRole() == AiChatMessage.MessageRole.ASSISTANT) {
                messages.add(AIProvider.Message.assistant(h.getContent()));
            }
        }

        messages.add(AIProvider.Message.user(userMessage));
        return messages;
    }

    private void enrichWithProductContext(List<AIProvider.Message> messages, String userMessage) {
        Matcher productMatcher = PRODUCT_QUERY_PATTERN.matcher(userMessage);
        if (!productMatcher.find()) return;

        List<Product> products = productRepository.findByStatusOrderBySoldCountDesc(
                "ACTIVE", PageRequest.of(0, 10));

        if (products.isEmpty()) return;

        List<ProductSuggestionDto> suggestions = products.stream()
                .map(recommendationService::toSuggestionDto)
                .toList();

        String contextBlock = PromptBuilder.buildProductContextBlock(suggestions);
        String lastUserMsg = messages.get(messages.size() - 1).content() + contextBlock;
        messages.set(messages.size() - 1, AIProvider.Message.user(lastUserMsg));
    }

    @Transactional
    protected void saveMessages(AiChatConversation conversation, String userMessage,
                                AIProvider.ChatCompletion completion, long latency) {
        messageRepository.save(AiChatMessage.builder()
                .conversation(conversation)
                .role(AiChatMessage.MessageRole.USER)
                .content(userMessage)
                .status(AiChatMessage.MessageStatus.SUCCESS)
                .build());

        messageRepository.save(AiChatMessage.builder()
                .conversation(conversation)
                .role(AiChatMessage.MessageRole.ASSISTANT)
                .content(completion.content())
                .tokensUsed(completion.totalTokens())
                .promptTokens(completion.promptTokens())
                .completionTokens(completion.completionTokens())
                .modelUsed(completion.modelUsed())
                .latencyMs(latency)
                .status(AiChatMessage.MessageStatus.SUCCESS)
                .build());
    }

    private void updateConversationTitle(AiChatConversation conversation, String firstMessage) {
        if (conversation.getTitle() == null) {
            String title = firstMessage.length() > 50
                    ? firstMessage.substring(0, 47) + "..."
                    : firstMessage;
            conversation.setTitle(title);
            conversationRepository.save(conversation);
        }
    }

    private List<ProductSuggestionDto> extractProductSuggestions(String aiReply, String userMessage) {
        Matcher matcher = PRODUCT_QUERY_PATTERN.matcher(userMessage);
        if (!matcher.find()) return Collections.emptyList();

        return productRepository.findByStatusOrderBySoldCountDesc("ACTIVE", PageRequest.of(0, 3))
                .stream()
                .map(recommendationService::toSuggestionDto)
                .toList();
    }
}
