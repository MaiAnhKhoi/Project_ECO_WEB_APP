package com.tlcn.fashion_api.entity.product;

import com.tlcn.fashion_api.repository.product.ProductCategoryId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory {

    @EmbeddedId
    private ProductCategoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    // Convenience getter/setter cho dễ xài trong code thống kê
    public Long getProductId() {
        return id != null ? id.getProductId() : null;
    }

    public Long getCategoryId() {
        return id != null ? id.getCategoryId() : null;
    }
}
