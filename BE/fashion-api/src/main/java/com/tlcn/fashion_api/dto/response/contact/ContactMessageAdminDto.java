package com.tlcn.fashion_api.dto.response.contact;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageAdminDto {
    private Long id;
    private String name;
    private String email;
    private String message;
    private String status;
    private String note;
    private String handledBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

