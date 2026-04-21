package com.tlcn.fashion_api.payos;

import lombok.Data;

@Data
public class PayOSCreatePaymentLinkResponse {

    private String paymentLinkId;
    private String checkoutUrl;
    private String qrCode;
}
