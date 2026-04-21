package com.tlcn.fashion_api.dto.response.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAdminDto {
    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String userName;
    private Byte rating;
    private String status;
    private String content;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
}

