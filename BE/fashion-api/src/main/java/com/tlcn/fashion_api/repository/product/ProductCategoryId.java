package com.tlcn.fashion_api.repository.product;

import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategoryId implements Serializable {
    private Long productId;
    private Long categoryId;
}