package com.tlcn.fashion_api.dto.request.product;

import lombok.Data;

@Data
public class UpdateStockRequest {
    private Integer quantity;
    private Integer safetyStock;
    private String location;
}