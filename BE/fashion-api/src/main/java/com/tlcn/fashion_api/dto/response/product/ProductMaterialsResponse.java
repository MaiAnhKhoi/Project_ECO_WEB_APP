package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialsResponse {
    private Long productId;
    private String title;
    private List<String> items;
}