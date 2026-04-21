package com.tlcn.fashion_api.dto.response.message;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageAttachmentDto {
    private Long id;
    private String url;
    private String mimeType;
}