package com.tlcn.fashion_api.dto.response.message;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageThreadSummaryDto {

    private Long id;
    private String subject;
    private Long otherUserId;      // với customer chat: là id customer
    private String otherUserName;

    private String lastMessagePreview;
    private LocalDateTime lastMessageTime;

    private long unreadCount;      // 🔥 tính từ message_reads
}
