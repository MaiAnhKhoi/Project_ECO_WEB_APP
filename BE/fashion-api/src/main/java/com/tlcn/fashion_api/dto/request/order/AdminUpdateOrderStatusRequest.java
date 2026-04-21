package com.tlcn.fashion_api.dto.request.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateOrderStatusRequest {
    private String status; // pending, processing, confirmed, completed
    private String note;
}
