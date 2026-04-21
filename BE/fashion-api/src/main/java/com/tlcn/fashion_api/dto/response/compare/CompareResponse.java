package com.tlcn.fashion_api.dto.response.compare;

import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompareResponse {
    private Long comparisonId;
    private String comparisonName;
    private List<ProductCardResponse> products;
    private Integer totalItems;
}