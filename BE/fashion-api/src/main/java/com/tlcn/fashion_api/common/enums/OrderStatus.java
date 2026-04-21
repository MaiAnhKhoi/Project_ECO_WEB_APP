package com.tlcn.fashion_api.common.enums;

public enum OrderStatus {
    PENDING,     // mới tạo, chờ xử lý / chờ thanh toán
    PROCESSING,  // đã thanh toán, đang xử lý
    CANCELLED,
    CANCEL_REQUESTED,// đã hủy
    CONFIRMED,   // nếu bạn muốn tách confirm
    COMPLETED    // đã giao xong
}