package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ConversationHistoryDto {

    private Long conversationId;
    private String sessionId;
    private String title;
    private List<ChatMessageDto> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
