package com.tlcn.fashion_api.dto.request.order;



import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class AdminUpdateShippingStatusRequest {
    private String shippingStatus; // unfulfilled, shipping, delivered
}
