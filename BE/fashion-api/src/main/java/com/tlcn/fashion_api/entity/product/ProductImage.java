package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id") // có thể null
    private ProductVariant variant;

    @Column(name = "image_url", nullable = false, length = 1024)
    private String imageUrl;

    private String altText;

    private Integer sortOrder;

    private Boolean isPrimary;
}

