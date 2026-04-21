package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDescriptionResponse {
    private Long productId;
    private String title;
    private List<String> paragraphs;
    private List<String> bulletPoints;
}