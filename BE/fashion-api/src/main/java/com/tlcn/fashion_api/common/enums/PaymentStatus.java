package com.tlcn.fashion_api.common.enums;

public enum PaymentStatus {
    UNPAID,   // chưa thanh toán
    PENDING,  // đã tạo link / QR, chờ thanh toán
    PAID,     // đã thanh toán
    FAILED,   // thất bại
    EXPIRED,
    REFUNDED// quá hạn
}