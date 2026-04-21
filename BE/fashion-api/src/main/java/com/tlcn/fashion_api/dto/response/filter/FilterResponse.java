package com.tlcn.fashion_api.dto.response.filter;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FilterResponse {

    private List<CategoryFilterItem> categories;
    private AvailabilityFilter availability;
    private PriceFilter price;
    private List<ColorFilterItem> colors;
    private List<SizeFilterItem> sizes;
    private List<BrandFilterItem> brands;

    // ==== inner DTOs ====

    @Data
    public static class CategoryFilterItem {
        private Long id;
        private String name;
        private String slug;
        private Long count;
    }

    @Data
    public static class AvailabilityFilter {
        private Long inStock;
        private Long outOfStock;
    }

    @Data
    public static class PriceFilter {
        private BigDecimal min;
        private BigDecimal max;
    }

    @Data
    public static class ColorFilterItem {
        private Long id;
        private String name;
        private Long count;
    }

    @Data
    public static class SizeFilterItem {
        private Long attributeId;
        private String size;
        private Long count;
    }

    @Data
    public static class BrandFilterItem {
        private Long id;
        private String name;
        private Long count;
    }
}

