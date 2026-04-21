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
public class LogisticsStatistics {

    private Long totalOrdersWithShipping; // Số đơn có shipping_status
    private Long unfulfilledOrders;       // unfulfilled
    private Long shippingOrders;          // shipping / shipped (đang giao)
    private Long deliveredOrders;         // delivered
    private Long failedDeliveryOrders;    // failed

    private BigDecimal deliverySuccessRate; // % giao thành công = delivered / (delivered + failed) * 100

    // Breakdown chi tiết theo từng shipping_status
    private List<StatusCountDto> shippingStatusBreakdown;
}