package com.tlcn.fashion_api.dto.response.address;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String company;
    private String address1;
    private String city;
    private String region;   // country
    private String province;
    private String phone;
    private Boolean isDefault;
}