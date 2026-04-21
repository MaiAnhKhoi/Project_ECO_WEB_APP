package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class VariantAttributeValueId implements Serializable {

    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "attribute_id")
    private Long attributeId;

    @Column(name = "attribute_value_id")
    private Long attributeValueId;
}

