package com.tlcn.fashion_api.dto.response.order;

import lombok.Data;

@Data
public class OrderAddressResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String address1;
    private String city;
    private String province;
    private String region;
    private String company;
}
