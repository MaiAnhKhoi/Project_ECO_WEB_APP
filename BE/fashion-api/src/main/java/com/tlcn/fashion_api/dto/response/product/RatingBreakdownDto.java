package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingBreakdownDto {
    private int rating; // 1..5
    private long count;
}
