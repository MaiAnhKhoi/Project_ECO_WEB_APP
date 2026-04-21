package com.tlcn.fashion_api.dto.request.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancelOrderRequest {
    private String reason;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}
