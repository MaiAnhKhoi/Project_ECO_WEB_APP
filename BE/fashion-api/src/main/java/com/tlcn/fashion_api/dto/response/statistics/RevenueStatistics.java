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
public class RevenueStatistics {
    private BigDecimal today;
    private BigDecimal thisWeek;
    private BigDecimal thisMonth;
    private BigDecimal thisYear;
    private BigDecimal total;
}

