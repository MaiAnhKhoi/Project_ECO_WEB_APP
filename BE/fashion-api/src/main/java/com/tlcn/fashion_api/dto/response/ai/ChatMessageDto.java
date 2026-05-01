package com.tlcn.fashion_api.dto.response.ai;

import com.tlcn.fashion_api.entity.ai.AiChatMessage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageDto {

    private Long id;
    private String role;
    private String content;
    private LocalDateTime createdAt;
    private Integer tokensUsed;

    public static ChatMessageDto from(AiChatMessage msg) {
        return ChatMessageDto.builder()
                .id(msg.getId())
                .role(msg.getRole().name().toLowerCase())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .tokensUsed(msg.getTokensUsed())
                .build();
    }
}
