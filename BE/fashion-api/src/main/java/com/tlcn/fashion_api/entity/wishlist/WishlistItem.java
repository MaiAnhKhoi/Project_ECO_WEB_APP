package com.tlcn.fashion_api.entity.wishlist;

import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "wishlist_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_wli",
                        columnNames = {"wishlist_id", "product_id", "variant_id_coalesced"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → wishlist
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    // FK → products
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // FK → product_variants
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant; // có thể null

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // GENERATED ALWAYS AS (coalesce(`variant_id`,0))
    @Column(name = "variant_id_coalesced", insertable = false, updatable = false)
    private Long variantIdCoalesced;
}
