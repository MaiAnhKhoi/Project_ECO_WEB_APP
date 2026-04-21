package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand_id")
    private Long brandId;

    private String name;

    private String slug;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;

    private String tags;
    private String material;

    private String careInstructions;

    private String countryOfOrigin;

    private Boolean isFeatured;

    private Integer viewCount;
    private Integer soldCount;

    private BigDecimal basePrice;

    private String status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /* --------------------
        RELATIONSHIPS
    --------------------- */

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private Set<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductCategory> productCategories;


    @OneToMany(mappedBy = "product")
    private List<ProductRelation> relations;

}
