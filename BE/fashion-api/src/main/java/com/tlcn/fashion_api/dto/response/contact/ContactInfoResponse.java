package com.tlcn.fashion_api.dto.response.contact;

import lombok.Data;

@Data
public class ContactInfoResponse {
    private String shopName;
    private String logoUrl;
    private String address;
    private String phone;
    private String email;
    private String openingHours;
    private String mapIframe;

    private String facebookUrl;
    private String instagramUrl;
    private String xUrl;
    private String snapchatUrl;
}
