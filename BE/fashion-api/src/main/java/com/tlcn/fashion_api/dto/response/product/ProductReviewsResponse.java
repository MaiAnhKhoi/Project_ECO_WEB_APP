package com.tlcn.fashion_api.dto.response.product;

import java.util.List;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewsResponse {
    private Long productId;
    private ReviewSummaryDto summary;
    private List<ReviewItemDto> reviews;
}