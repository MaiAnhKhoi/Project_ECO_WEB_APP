package com.tlcn.fashion_api.common.enums;

public enum UserStatus {
    PENDING,        // Đang chờ verify email
    ACTIVE,         // Đã kích hoạt, có thể login
    SUSPENDED,      // Bị tạm khóa
    LOCKED,         // Bị khóa do đăng nhập sai nhiều lần
    INACTIVE        // Không hoạt động (tự deactivate hoặc admin deactivate)
}
