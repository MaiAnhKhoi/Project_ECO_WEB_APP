package com.tlcn.fashion_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String company;     // nếu cần sau này có thể map vào line2

    @NotBlank
    private String address1;

    @NotBlank
    private String city;

    @NotBlank
    private String region;      // Country/region  → country

    private String province;

    @NotBlank
    private String phone;

    // FE gửi true nếu muốn set mặc định khi thêm/sửa
    private Boolean isDefault = false;
}