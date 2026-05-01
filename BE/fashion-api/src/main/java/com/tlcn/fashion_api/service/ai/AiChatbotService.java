package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.dto.request.ai.ChatRequest;
import com.tlcn.fashion_api.dto.response.ai.ChatResponse;
import com.tlcn.fashion_api.dto.response.ai.ConversationHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AiChatbotService {

    ChatResponse chat(ChatRequest request, Long userId);

    Page<ConversationHistoryDto> getChatHistory(Long userId, Pageable pageable);

    ConversationHistoryDto getConversation(Long conversationId, Long userId);
}
