package com.tlcn.fashion_api.entity.address;

import com.tlcn.fashion_api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // receiver: sẽ lưu "firstName lastName"
    @Column(name = "receiver", nullable = false, length = 120)
    private String receiver;

    @Column(name = "phone", nullable = false, length = 32)
    private String phone;

    @Column(name = "line1", nullable = false, length = 255)
    private String line1;

    @Column(name = "line2", length = 255)
    private String line2;

    @Column(name = "ward", length = 120)
    private String ward;

    @Column(name = "district", length = 120)
    private String district;

    @Column(name = "city", length = 120)
    private String city;

    @Column(name = "province", length = 120)
    private String province;

    @Column(name = "country", length = 120, nullable = false)
    private String country;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (country == null) {
            country = "VN";
        }
        if (isDefault == null) {
            isDefault = false;
        }
    }
}

