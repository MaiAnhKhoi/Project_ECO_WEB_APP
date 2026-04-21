package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "variant_images")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class VariantImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(nullable = false, length = 1024)
    private String imageUrl;

    // ⭐ THÊM ALT TEXT
    @Column(name = "alt_text")
    private String altText;

    private Integer sortOrder = 1;

    private Boolean isPrimary = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
