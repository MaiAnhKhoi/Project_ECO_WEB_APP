package com.tlcn.fashion_api.common.enums;

public enum VerificationType {
    EMAIL_VERIFICATION,     // Xác thực email khi đăng ký
    PASSWORD_RESET,         // Đặt lại mật khẩu
    TWO_FACTOR,            // Xác thực 2 yếu tố
    PHONE_VERIFICATION,    // Xác thực số điện thoại
    EMAIL_CHANGE           // Thay đổi email
}

