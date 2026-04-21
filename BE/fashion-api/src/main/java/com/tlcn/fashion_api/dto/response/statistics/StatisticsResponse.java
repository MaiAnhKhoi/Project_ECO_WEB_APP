package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private OverviewStatistics overview;
    private RevenueStatistics revenue;
    private OrderStatistics orders;
    private ProductStatistics products;
    private UserStatistics users;
    private List<TopProductDto> topProducts;
    private List<TopCustomerDto> topCustomers;
    private DetailedStatistics detailed; // Chi tiết theo thời gian
    private InventoryStatistics inventory;
    private ProfitStatistics profit;
    private List<CategoryPerformanceDto> categoryPerformance;

    private ReturnStatistics returns;
    private LogisticsStatistics logistics;
}

