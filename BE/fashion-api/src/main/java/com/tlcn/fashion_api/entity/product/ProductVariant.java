package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String sku;

    private BigDecimal price;

    @Column(name = "compare_at_price")
    private BigDecimal compareAtPrice;

    @Column(name = "cost_price")
    private BigDecimal costPrice;

    @Column(name = "weight_gram")
    private Integer weightGram;

    /**
     * DB có thêm cột weight (double) → giữ lại nếu sau này dùng
     */
    @Column(name = "weight")
    private Double weight;

    @Column(name = "is_default")
    private Boolean isDefault;   // map đúng với cột is_default (bit)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String status;

    @Builder.Default
    @OneToMany(mappedBy = "variant",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private Set<VariantAttributeValue> attributeValues = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "variant",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private Set<Stock> stocks = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "variant",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @OrderBy("isPrimary DESC, sortOrder ASC, id ASC")
    private List<VariantImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
