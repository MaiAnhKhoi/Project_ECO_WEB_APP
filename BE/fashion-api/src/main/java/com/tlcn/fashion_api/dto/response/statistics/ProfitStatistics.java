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
public class ProfitStatistics {
    private BigDecimal totalRevenue;
    private BigDecimal totalCogs;          // Giá vốn
    private BigDecimal totalGrossProfit;   // Lợi nhuận gộp
    private BigDecimal totalGrossMargin;   // % lợi nhuận gộp

    private BigDecimal todayRevenue;
    private BigDecimal todayCogs;
    private BigDecimal todayProfit;

    private BigDecimal thisMonthRevenue;
    private BigDecimal thisMonthCogs;
    private BigDecimal thisMonthProfit;
}
