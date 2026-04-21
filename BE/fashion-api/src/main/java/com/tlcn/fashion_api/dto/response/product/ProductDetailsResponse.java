package com.tlcn.fashion_api.dto.response.product;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailsResponse {

    private Long productId;

    private ProductDescriptionResponse description;

    private ProductMaterialsResponse materials;

    private List<AdditionalInfoItem> additionalInfo;


    private ProductReviewsResponse reviews;


}