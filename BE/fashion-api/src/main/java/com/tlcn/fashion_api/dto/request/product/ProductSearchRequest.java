package com.tlcn.fashion_api.dto.request.product;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {

    /**
     * Từ khóa tìm kiếm chính
     * Sẽ tìm trong: name, description, tags, brand, category
     */
    private String keyword;

    /**
     * Các filter bổ sung (optional)
     */
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<Long> brandIds;
    private List<String> categoryIds;
    private List<String> categories; // Category slugs hoặc names
    private List<String> tags; // Filter theo tags
    private List<String> colors;
    private List<String> sizes;
    private Boolean inStock;

    /**
     * Phân trang
     */
    @Builder.Default
    private Integer page = 0;

    @Builder.Default
    private Integer size = 16;

    /**
     * Sắp xếp
     * Các giá trị: "relevance" (mặc định), "price_asc", "price_desc", "name", "newest"
     */
    @Builder.Default
    private String sortBy = "relevance";
}

