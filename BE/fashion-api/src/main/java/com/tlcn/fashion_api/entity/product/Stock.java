package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "safety_stock", nullable = false)
    private Integer safetyStock;
    
    @Builder.Default
    @Column(name = "disable_safety_warning")
    private Boolean disableSafetyWarning = false;
    
    @Column(name = "location")
    private String location;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}

