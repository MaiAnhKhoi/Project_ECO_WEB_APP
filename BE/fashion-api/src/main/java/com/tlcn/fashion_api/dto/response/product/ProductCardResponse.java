package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCardResponse {

    private Long id;
    private String title;
    private String imgSrc;
    private String imgHover;
    private Integer width;
    private Integer height;

    private BigDecimal price;
    private BigDecimal oldPrice;
    private String saleLabel;

    private List<String> sizes;        // all sizes
    private List<String> filterSizes;
    private List<String> filterColor;
    private List<String> filterBrands;

    private List<ColorOption> colors;  // per color

    private boolean inStock;

    private Long categoryId;      // category chính
    private String categoryName;  // tên category chính
    private String categorySlug;

    // ====== Thông tin bổ sung cho so sánh / hiển thị chi tiết nhanh ======
    /**
     * Chất liệu sản phẩm (vd: Cotton, Linen...)
     */
    private String material;

    /**
     * Xuất xứ (vd: Việt Nam, Hàn Quốc...)
     */
    private String countryOfOrigin;

    /**
     * Tên thương hiệu (được resolve từ brandId)
     */
    private String brandName;

    /**
     * Danh sách tên màu (vd: "Đen, Trắng, Xanh navy") – phục vụ bảng so sánh.
     */
    private String colorNames;

    /* ============================
       ⭐ NESTED DTO: ColorOption
       ============================ */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColorOption {
        private String label;     // "Trắng"
        private String value;     // "bg-white"
        private String img;       // image of that color
        private List<SizeOption> sizes; // size list per color
    }

    /* ============================
       ⭐ NESTED DTO: SizeOption
       ============================ */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SizeOption {
        private String size;      // "M"
        private boolean inStock;  // true/false
        private Long variantId;
        private Integer stockQuantity;// ID để add-to-cart
    }
}
