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
public class OverviewStatistics {
    private Long totalUsers;
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalRevenue;

    private Long todayOrders;
    private BigDecimal todayRevenue;

    private Long thisWeekOrders;
    private BigDecimal thisWeekRevenue;

    private Long thisMonthOrders;
    private BigDecimal thisMonthRevenue;

    // Đã thêm trước đó
    private Long totalUnitsSold;
    private Long totalProductViews;

    // NEW
    private Long totalSkus;
    private Long totalUnitsInStock;
}
