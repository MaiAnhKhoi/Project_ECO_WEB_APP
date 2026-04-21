package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.product.ProductSearchRequest;
import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import com.tlcn.fashion_api.dto.response.product.ProductDetailsResponse;
import com.tlcn.fashion_api.dto.response.product.ProductSearchResponse;
import com.tlcn.fashion_api.service.product.ProductService;
import com.tlcn.fashion_api.service.product.ProductTabService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService service;
    private final ProductTabService productTabService;

    @GetMapping
    public Page<ProductCardResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size
    ) {
        return service.getAllProductsPaged(page, size);
    }

    @GetMapping("/{id}")
    public ProductCardResponse getProductDetail(@PathVariable Long id) {
        return service.getProductDetail(id);
    }

    /**
     * Tăng view count cho sản phẩm
     * Frontend nên gọi endpoint này riêng, chỉ 1 lần khi user thực sự xem trang
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<Map<String, String>> incrementViewCount(@PathVariable Long id) {
        try {
            service.incrementProductViewCount(id);
            return ResponseEntity.ok(Map.of("message", "View count incremented"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/best-sellers")
    public List<ProductCardResponse> bestSellers(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.bestSellers(limit);
    }

    @GetMapping("/new-arrivals")
    public List<ProductCardResponse> newArrivals(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.newArrivals(limit);
    }

    @GetMapping("/most-popular")
    public List<ProductCardResponse> mostPopular(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.mostPopular(limit);
    }

    @GetMapping("/best-deals")
    public List<ProductCardResponse> bestDeals(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.bestDeals(limit);
    }

    @GetMapping("/todays-picks")
    public List<ProductCardResponse> todayPicks(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return service.todayPicks(limit);
    }

    @GetMapping("/featured")
    public List<ProductCardResponse> featuredProducts(
            @RequestParam(defaultValue = "12") int limit
    ) {
        return service.featuredProducts(limit);
    }

    @GetMapping("/by-category")
    public List<ProductCardResponse> getProductsByCategory(
            @RequestParam("slug") String slug,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return service.getByCategorySlug(slug, limit);
    }

    // 🆕 API lọc + sort theo filter
    @GetMapping("/filter")
    public Page<ProductCardResponse> getFilteredProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> brandIds, // FE gửi string (id)
            @RequestParam(required = false) List<String> categories, // slug category
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir
    ) {
        // convert brandIds String -> Long
        List<Long> brandIdLongs = null;
        if (brandIds != null && !brandIds.isEmpty()) {
            brandIdLongs = brandIds.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .map(Long::valueOf)
                    .toList();
        }

        return service.getAllProductsFiltered(
                page,
                size,
                minPrice,
                maxPrice,
                brandIdLongs,
                categories,
                colors,
                sizes,
                inStock,
                sortBy,
                sortDir
        );
    }
    @GetMapping("/{productId}/details")
    public ProductDetailsResponse getDetails(@PathVariable Long productId) {
        var additional = productTabService.getAdditionalInfo(productId).getItems();

        return ProductDetailsResponse.builder()
                .productId(productId)
                .description(productTabService.getDescription(productId))
                .materials(productTabService.getMaterials(productId))
                .additionalInfo(additional)   // ✔ đúng kiểu List<AdditionalInfoItem>
                .reviews(productTabService.getReviews(productId))
                .build();
    }


    // =====================================================
    //  ⭐ FUZZY SEARCH API
    // =====================================================

    /**
     * 🔍 Basic Search - Tìm kiếm sản phẩm theo từ khóa
     *
     * Tìm kiếm fuzzy trong các trường:
     * - Tên sản phẩm
     * - Mô tả
     * - Tags
     * - Meta keywords
     * - Brand name
     * - Category name
     *
     * Kết quả được sắp xếp theo độ liên quan (relevance score)
     *
     * @param keyword Từ khóa tìm kiếm
     * @param page Số trang (mặc định: 0)
     * @param size Số item mỗi trang (mặc định: 16)
     * @param sortBy Sắp xếp theo: relevance (mặc định), price_asc, price_desc, name, newest
     * @return Page of ProductSearchResponse với relevance score
     *
     * Example: GET /api/products/search?keyword=áo+thun&page=0&size=20
     */
    @GetMapping("/search")
    public Page<ProductSearchResponse> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size,
            @RequestParam(defaultValue = "relevance") String sortBy
    ) {
        ProductSearchRequest request = ProductSearchRequest.builder()
                .keyword(keyword)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .build();

        return service.searchProducts(request);
    }

    /**
     * 🔍 Advanced Search - Tìm kiếm sản phẩm với filters
     *
     * Kết hợp fuzzy search với các filter:
     * - Price range (minPrice, maxPrice)
     * - Brand IDs
     * - Colors
     * - Sizes
     * - Stock availability
     *
     * @param keyword Từ khóa tìm kiếm (required)
     * @param page Số trang
     * @param size Số item mỗi trang
     * @param minPrice Giá tối thiểu
     * @param maxPrice Giá tối đa
     * @param brandIds Danh sách brand ID (có thể nhiều)
     * @param colors Danh sách màu sắc (có thể nhiều)
     * @param sizes Danh sách size (có thể nhiều)
     * @param inStock true=còn hàng, false=hết hàng, null=tất cả
     * @param sortBy Sắp xếp theo: relevance, price_asc, price_desc, name, newest
     * @return Page of ProductSearchResponse
     *
     * Example: GET /api/products/search/advanced?keyword=áo&minPrice=100000&maxPrice=500000&brandIds=1,2&colors=Đen,Trắng&inStock=true
     */
    @GetMapping("/search/advanced")
    public Page<ProductSearchResponse> searchProductsAdvanced(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> brandIds,   // FE gửi string
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "relevance") String sortBy
    ) {

        // Convert brandIds String -> Long
        List<Long> brandIdLongs = null;
        if (brandIds != null && !brandIds.isEmpty()) {
            brandIdLongs = brandIds.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .map(Long::valueOf)
                    .toList();
        }

        ProductSearchRequest request = ProductSearchRequest.builder()
                .keyword(keyword)
                .page(page)
                .size(size)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .brandIds(brandIdLongs)
                .categories(categories)
                .tags(tags)
                .colors(colors)
                .sizes(sizes)
                .inStock(inStock)
                .sortBy(sortBy)
                .build();

        return service.searchProductsWithFilters(request);
    }



}
