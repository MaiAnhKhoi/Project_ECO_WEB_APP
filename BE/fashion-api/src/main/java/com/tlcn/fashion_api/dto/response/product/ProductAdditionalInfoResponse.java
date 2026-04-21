package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAdditionalInfoResponse {
    private Long productId;
    private List<AdditionalInfoItem> items;
}
