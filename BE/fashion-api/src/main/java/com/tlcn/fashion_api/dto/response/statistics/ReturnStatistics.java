package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnStatistics {

    private Long totalOrders;          // Tổng số đơn
    private Long cancelledOrders;      // Số đơn bị hủy
    private BigDecimal cancelledRevenue; // Tổng doanh thu "bị mất" do hủy

    private BigDecimal cancelRatePercent; // = cancelledOrders / totalOrders * 100 (%)

    // Top lý do hủy
    private List<ReasonCountDto> topCancelReasons;
}
