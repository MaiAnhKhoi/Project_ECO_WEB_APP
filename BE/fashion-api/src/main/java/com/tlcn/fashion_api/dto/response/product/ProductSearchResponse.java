package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response cho tìm kiếm sản phẩm
 * Chứa thông tin sản phẩm và thông tin về độ liên quan
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchResponse {

    // ====== Thông tin cơ bản của sản phẩm (giống ProductCardResponse) ======
    private Long id;
    private String title;
    private String imgSrc;
    private String imgHover;
    private Integer width;
    private Integer height;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private String saleLabel;
    private List<String> sizes;
    private List<String> filterSizes;
    private List<String> filterColor;
    private List<String> filterBrands;
    private List<ProductCardResponse.ColorOption> colors;
    private boolean inStock;

    // ====== Thông tin bổ sung cho search ======

    /**
     * Điểm số relevance (càng cao càng liên quan)
     */
    private Double relevanceScore;

    /**
     * Highlight các từ khóa match (optional)
     */
    private String highlightedTitle;

    /**
     * Thông tin match
     */
    private List<String> matchedFields; // ["name", "brand", "description"]

    /**
     * Thông tin brand và category
     */
    private String brandName;
    private String categoryName;
}

