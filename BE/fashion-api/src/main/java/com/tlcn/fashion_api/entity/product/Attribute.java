package com.tlcn.fashion_api.entity.product;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "attributes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tên hiển thị: "Màu sắc", "Size", "Chất liệu"
     */
    @Column(nullable = false)
    private String name;

    /**
     * Mã code để FE/BE dùng cố định: COLOR, SIZE, MATERIAL...
     */
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    /**
     * Kiểu thuộc tính: text, color, size...
     * Có thể để enum sau này (AttributeType)
     */
    @Column(length = 50)
    private String type;

    /**
     * Để sắp xếp thứ tự hiển thị
     */
    private Integer sortOrder;

    @OneToMany(
            mappedBy = "attribute",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<AttributeValue> values;
}
