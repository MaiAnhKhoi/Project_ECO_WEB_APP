package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_relations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long relatedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
