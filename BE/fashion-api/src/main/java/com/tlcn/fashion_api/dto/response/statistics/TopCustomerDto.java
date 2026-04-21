package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopCustomerDto {
    private Long userId;
    private String userName;
    private String userEmail;
    private Long orderCount;
    private BigDecimal totalSpent;
}

