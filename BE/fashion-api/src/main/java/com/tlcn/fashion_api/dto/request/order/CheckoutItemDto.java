package com.tlcn.fashion_api.dto.request.order;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutItemDto {

    @NotNull
    private Long productId;

    @NotNull
    private Long variantId;

    @NotNull
    @Min(1)
    @JsonProperty("quantity")     // map "quantity"
    @JsonAlias({"qty"})           // và map luôn "qty" nếu FE/Postman gửi vậy
    private Integer quantity;

    @NotNull
    private BigDecimal unitPrice;
}