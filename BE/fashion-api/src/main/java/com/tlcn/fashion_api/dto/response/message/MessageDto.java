package com.tlcn.fashion_api.dto.response.message;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {

    private Long id;
    private Long threadId;
    private Long senderId;
    private String senderName;
    private String contentText;
    private LocalDateTime createdAt;
    private boolean mine;
    private boolean read;

    private List<AttachmentDto> attachments;
}