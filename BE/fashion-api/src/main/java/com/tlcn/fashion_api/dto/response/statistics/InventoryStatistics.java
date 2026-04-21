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
public class InventoryStatistics {
    private Long totalProducts;          // Tổng product
    private Long totalSkus;              // Tổng variant
    private Long totalUnitsInStock;      // Tổng tồn kho thực tế (available)
    private Long outOfStockVariants;     // Số variant hết hàng
    private Long lowStockVariants;       // Số variant sắp hết hàng

    private BigDecimal inventoryCostValue;       // Giá trị vốn hàng
    private BigDecimal inventoryRetailValue;     // Giá trị bán ra theo price
    private BigDecimal inventoryPotentialProfit; // Lợi nhuận tiềm năng = retail - cost
}