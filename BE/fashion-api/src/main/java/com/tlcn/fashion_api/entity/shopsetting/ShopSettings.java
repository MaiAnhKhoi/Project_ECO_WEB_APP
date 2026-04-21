package com.tlcn.fashion_api.entity.shopsetting;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "shop_settings")
public class ShopSettings {

    @Id
    @Column(name = "id")
    // DB là tinyint(4) => dùng Byte hoặc Integer đều được
    private Byte id;

    @Column(name = "shop_name")
    private String shopName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "contact_address")
    private String contactAddress;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_opening_hours")
    private String contactOpeningHours;

    @Column(name = "contact_map_iframe")
    private String contactMapIframe;

    @Column(name = "social_facebook_url")
    private String socialFacebookUrl;

    @Column(name = "social_instagram_url")
    private String socialInstagramUrl;

    @Column(name = "social_x_url")
    private String socialXUrl;

    @Column(name = "social_snapchat_url")
    private String socialSnapchatUrl;

    @Column(name = "currency")
    private String currency;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "tax_percent")
    private BigDecimal taxPercent;

    @Column(name = "email_from")
    private String emailFrom;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
