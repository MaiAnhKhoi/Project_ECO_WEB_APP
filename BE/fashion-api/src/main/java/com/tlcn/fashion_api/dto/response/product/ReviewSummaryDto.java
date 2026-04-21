package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDto {
    private double averageRating;
    private long totalReviews;
    private List<RatingBreakdownDto> breakdown;
}
