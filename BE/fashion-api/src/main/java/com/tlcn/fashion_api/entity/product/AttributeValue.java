package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "attribute_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributeValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Mã giá trị: VD "RED", "BLUE", "SIZE_M"
     */
    @Column(nullable = false, length = 50)
    private String code;

    /**
     * Giá trị hiển thị: "Đỏ", "Xanh lá", "M", "L", ...
     */
    @Column(nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attribute_id", nullable = false)
    private Attribute attribute;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "color_css_class", length = 50)
    private String colorCssClass; // "bg-danger", "bg-dark"

    @Column(name = "color_hex", length = 10)
    private String colorHex;      // "#ff0000"

    @OneToMany(
            mappedBy = "attributeValue",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<VariantAttributeValue> variantValues = new HashSet<>();
}
