package com.tlcn.fashion_api.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Quyền đánh giá: chỉ khi đã có ít nhất một lần mua hoàn thành (COMPLETED)
 * và số review hiện tại &lt; số lần mua hoàn thành.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEligibilityDto {
    private boolean canReview;
    private long completedPurchaseCount;
    private long reviewCount;
}
