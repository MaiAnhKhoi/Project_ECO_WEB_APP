package com.tlcn.fashion_api.entity.vton;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "virtual_tryon_history") // ✅ thiếu @ trước Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VirtualTryOnHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nếu sau này bạn có entity User thì có thể đổi sang @ManyToOne
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long productId;

    @Column
    private Long variantId;

    @Column(length = 50)
    private String category; // upper_body / lower_body / dresses ...

    @Column(columnDefinition = "TEXT")
    private String modelImageUrl;

    @Column(columnDefinition = "TEXT")
    private String garmentImageUrl;

    @Column(columnDefinition = "TEXT")
    private String resultImageUrl;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
