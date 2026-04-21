package com.tlcn.fashion_api.service.product;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.dto.request.product.*;
import com.tlcn.fashion_api.dto.response.product.*;
import com.tlcn.fashion_api.entity.product.*;
import com.tlcn.fashion_api.mapper.product.ProductCardMapper;
import com.tlcn.fashion_api.repository.brand.BrandRepository;
import com.tlcn.fashion_api.repository.category.CategoryRepository;
import com.tlcn.fashion_api.repository.product.*;
import com.tlcn.fashion_api.repository.stock.StockRepository;
import com.tlcn.fashion_api.entity.product.ProductCategory;
import com.tlcn.fashion_api.service.ai.FaceMatchService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository repo;
    private final ProductCardMapper mapper;
    private final AttributeRepository attributeRepository;
    private final BrandRepository brandRepository;


    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StockRepository stockRepository;
    private final ProductImageRepository productImageRepository;
    private final VariantImageRepository variantImageRepository;
    private final VariantAttributeValueRepository variantAttributeValueRepository;
    private final AttributeValueRepository attributeValueRepository;

    private final CloudinaryService cloudinaryService;
    private final FaceMatchService faceMatchService;
    private final ProductCategoryRepository productCategoryRepository;
    private static final String ACTIVE = "active";

    @Transactional(readOnly = true)
    public List<ProductCardResponse> bestSellers(int limit) {
        return mapper.toList(
                repo.findByStatusOrderBySoldCountDesc(ACTIVE, PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> newArrivals(int limit) {
        return mapper.toList(
                repo.findByStatusOrderByCreatedAtDesc(ACTIVE, PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> mostPopular(int limit) {
        return mapper.toList(
                repo.findByStatusOrderByViewCountDesc(ACTIVE, PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> bestDeals(int limit) {
        return mapper.toList(
                repo.findBestDeals(ACTIVE, PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> todayPicks(int limit) {
        return mapper.toList(
                repo.findTodayPicks(ACTIVE, "trending", "today-pick", PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> featuredProducts(int limit) {
        return mapper.toList(
                repo.findByStatusAndIsFeaturedOrderByCreatedAtDesc(ACTIVE, true, PageRequest.of(0, limit))
        );
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getByCategorySlug(String slug, int limit) {
        return mapper.toList(
                repo.findByCategorySlug(slug, ACTIVE, limit)
        );
    }

    @Transactional(readOnly = true)
    public Page<ProductCardResponse> getAllProductsPaged(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Product> productPage = repo.findByStatus(ACTIVE, pageable);

        List<ProductCardResponse> content = mapper.toList(productPage.getContent());

        return new PageImpl<>(
                content,
                productPage.getPageable(),
                productPage.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public Page<ProductCardResponse> getAllProductsFiltered(
            int page,
            int size,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<Long> brandIds,
            List<String> categories,   // slug category
            List<String> colors,
            List<String> sizes,
            Boolean inStock,
            String sortBy,
            String sortDir
    ) {
        // Sort
        Sort sort = Sort.unsorted();
        if (sortBy != null && !sortBy.isBlank()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortDir)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            sort = Sort.by(direction, sortBy);
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = Specification.allOf(hasStatus(ACTIVE));

        // Price
        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
        }

        // Brand
        if (brandIds != null && !brandIds.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("brandId").in(brandIds));
        }

        // Categories (filter theo slug) — include cả category con
        if (categories != null && !categories.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                Join<Product, ProductCategory> pcJoin = root.join("productCategories", JoinType.INNER);
                Join<ProductCategory, Category> categoryJoin = pcJoin.join("category", JoinType.INNER);
                // Match slug hoặc slug của parent
                return cb.or(
                        categoryJoin.get("slug").in(categories),
                        categoryJoin.get("parent").get("slug").in(categories)
                );
            });
        }

        // Lấy attribute names từ DB
        List<String> colorAttrNames = attributeRepository.findByType("color")
                .stream().map(Attribute::getName).toList();
        List<String> sizeAttrNames = attributeRepository.findByType("size")
                .stream().map(Attribute::getName).toList();

        // ===================== COLORS =====================
        if (colors != null && !colors.isEmpty() && !colorAttrNames.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);

                Join<Product, ProductVariant> variantJoin =
                        root.join("variants", JoinType.LEFT);

                Join<ProductVariant, VariantAttributeValue> vavJoin =
                        variantJoin.join("attributeValues", JoinType.LEFT);

                Join<VariantAttributeValue, Attribute> attributeJoin =
                        vavJoin.join("attribute", JoinType.LEFT);

                // ⭐ join sang bảng AttributeValue để lấy field value/code (String)
                Join<VariantAttributeValue, AttributeValue> avJoin =
                        vavJoin.join("attributeValue", JoinType.LEFT);

                // FE đang gửi "Đen", "Trắng", ... -> so sánh với cột value
                return cb.and(
                        attributeJoin.get("name").in(colorAttrNames),
                        avJoin.get("value").in(colors)   // <--- so sánh String với String
                        // nếu sau này FE gửi 'BLACK', 'WHITE' thì đổi sang avJoin.get("code").in(colors)
                );
            });
        }

        // ===================== SIZES =====================
        if (sizes != null && !sizes.isEmpty() && !sizeAttrNames.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);

                Join<Product, ProductVariant> variantJoin =
                        root.join("variants", JoinType.LEFT);

                Join<ProductVariant, VariantAttributeValue> vavJoin =
                        variantJoin.join("attributeValues", JoinType.LEFT);

                Join<VariantAttributeValue, Attribute> attributeJoin =
                        vavJoin.join("attribute", JoinType.LEFT);

                Join<VariantAttributeValue, AttributeValue> avJoin =
                        vavJoin.join("attributeValue", JoinType.LEFT);

                // FE gửi "S", "M", "L", "40"... -> so sánh với value
                return cb.and(
                        attributeJoin.get("name").in(sizeAttrNames),
                        avJoin.get("value").in(sizes)
                );
            });
        }

        // In-stock
        if (inStock != null) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                Join<Product, ProductVariant> variantJoin =
                        root.join("variants", JoinType.LEFT);
                Join<ProductVariant, Stock> stockJoin =
                        variantJoin.join("stocks", JoinType.LEFT);

                if (inStock) {
                    return cb.greaterThan(stockJoin.get("quantity"), 0);
                } else {
                    return cb.lessThanOrEqualTo(stockJoin.get("quantity"), 0);
                }
            });
        }

        Page<Product> productPage = repo.findAll(spec, pageable);
        List<ProductCardResponse> content = mapper.toList(productPage.getContent());

        return new PageImpl<>(
                content,
                productPage.getPageable(),
                productPage.getTotalElements()
        );
    }



    // ---- private helper ----

    private Specification<Product> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }


    /**
     * Lấy chi tiết sản phẩm KHÔNG tăng view count
     * Frontend nên dùng endpoint này để load product detail
     */
    @Transactional(readOnly = true)
    public ProductCardResponse getProductDetail(Long id) {
        Product product = repo.findDetailByIdAndStatus(id, ACTIVE)
                .orElseThrow(() -> new RuntimeException("Product not found or inactive"));

        return mapper.toCard(product);
    }

    /**
     * Tăng view count cho sản phẩm
     * Frontend nên gọi endpoint này riêng, chỉ 1 lần khi user thực sự xem trang
     */
    @Transactional
    public void incrementProductViewCount(Long id) {
        // Kiểm tra product tồn tại
        if (!repo.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        
        // ⭐️ FIX: Tăng view count bằng UPDATE query trực tiếp (atomic update)
        // Tránh race condition và duplicate increment
        repo.increaseViewCount(id);
    }




    /**
     * ⭐ FUZZY SEARCH API
     *
     * Tìm kiếm sản phẩm với fuzzy matching trong nhiều trường:
     * - Tên sản phẩm (name)
     * - Mô tả (description)
     * - Tags
     * - Meta keywords
     * - Tên brand
     * - Tên category
     *
     * Kết quả được sắp xếp theo điểm relevance (độ liên quan)
     */
    @Transactional(readOnly = true)
    public Page<ProductSearchResponse> searchProducts(ProductSearchRequest request) {
        String keyword = request.getKeyword();

        // Nếu không có keyword, return empty
        if (keyword == null || keyword.trim().isEmpty()) {
            return Page.empty();
        }

        // Clean keyword: trim và remove multiple spaces
        final String cleanKeyword = keyword.trim().replaceAll("\\s+", " ");

        // Tạo Pageable với sort
        Pageable pageable = createPageable(request);

        // Tìm kiếm với native query (có relevance score)
        Page<Product> productPage = repo.searchProductsByKeyword(cleanKeyword, ACTIVE, pageable);

        // ⭐ DISTINCT THEO ID – loại trùng product
        List<Product> distinctProducts = productPage.getContent().stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                Product::getId,              // key = id
                                p -> p,                      // value = product
                                (p1, p2) -> p1,              // nếu trùng id thì giữ bản đầu
                                LinkedHashMap::new           // giữ nguyên thứ tự
                        ),
                        m -> new ArrayList<>(m.values())
                ));

        // Convert to search response với thông tin bổ sung
        List<ProductSearchResponse> searchResults = distinctProducts.stream()
                .map(product -> convertToSearchResponse(product, cleanKeyword))
                .collect(Collectors.toList());

        return new PageImpl<>(
                searchResults,
                productPage.getPageable(),
                productPage.getTotalElements()   // totalElements dùng COUNT(DISTINCT p.id) là chuẩn
        );
    }


    /**
     * ⭐ ADVANCED FUZZY SEARCH với Filters
     *
     * Kết hợp fuzzy search với các filter bổ sung như:
     * - Price range
     * - Brand IDs
     * - Colors
     * - Sizes
     * - Stock availability
     */
    @Transactional(readOnly = true)
    public Page<ProductSearchResponse> searchProductsWithFilters(ProductSearchRequest request) {
        String keyword = request.getKeyword();

        // Clean keyword
        String cleanKeyword = (keyword != null) ? keyword.trim().replaceAll("\\s+", " ") : null;

        // Build specification with filters
        Specification<Product> spec = buildSearchSpecification(cleanKeyword, request);

        // Tạo Pageable với sort
        Pageable pageable = createPageable(request);

        // Execute query
        Page<Product> productPage = repo.findAll(spec, pageable);

        // Convert to search response
        List<ProductSearchResponse> searchResults = productPage.getContent().stream()
                .map(product -> convertToSearchResponse(product, cleanKeyword))
                .collect(Collectors.toList());

        return new PageImpl<>(
                searchResults,
                productPage.getPageable(),
                productPage.getTotalElements()
        );
    }


    // ========== PRIVATE HELPER METHODS ==========

    /**
     * Convert Product entity to ProductSearchResponse with relevance score
     */
    private ProductSearchResponse convertToSearchResponse(Product product, String keyword) {
        // Tạo base ProductCardResponse
        ProductCardResponse baseCard = mapper.toCard(product);

        // Tính điểm relevance
        double relevanceScore = calculateRelevanceScore(product, keyword);

        // Tìm các trường matched
        List<String> matchedFields = findMatchedFields(product, keyword);

        // Highlight title
        String highlightedTitle = highlightKeyword(product.getName(), keyword);

        // Lấy brand name
        String brandName = null;
        if (product.getBrandId() != null) {
            brandName = brandRepository.findById(product.getBrandId())
                    .map(Brand::getName)
                    .orElse(null);
        }

        String categoryName = null;

        if (product.getProductCategories() != null && !product.getProductCategories().isEmpty()) {
            // Lấy ProductCategory đầu tiên
            ProductCategory pc = product.getProductCategories().iterator().next();

            if (pc.getCategory() != null) {
                categoryName = pc.getCategory().getName();
            }
        }


        return ProductSearchResponse.builder()
                .id(baseCard.getId())
                .title(baseCard.getTitle())
                .imgSrc(baseCard.getImgSrc())
                .imgHover(baseCard.getImgHover())
                .width(baseCard.getWidth())
                .height(baseCard.getHeight())
                .price(baseCard.getPrice())
                .oldPrice(baseCard.getOldPrice())
                .saleLabel(baseCard.getSaleLabel())
                .sizes(baseCard.getSizes())
                .filterSizes(baseCard.getFilterSizes())
                .filterColor(baseCard.getFilterColor())
                .filterBrands(baseCard.getFilterBrands())
                .colors(baseCard.getColors())
                .inStock(baseCard.isInStock())
                .relevanceScore(relevanceScore)
                .highlightedTitle(highlightedTitle)
                .matchedFields(matchedFields)
                .brandName(brandName)
                .categoryName(categoryName)
                .build();
    }

    /**
     * Tính điểm relevance dựa trên số lượng matches và vị trí
     */
    private double calculateRelevanceScore(Product product, String keyword) {
        double score = 0.0;
        String lowerKeyword = keyword.toLowerCase();

        // Name match (highest priority)
        if (product.getName() != null && product.getName().toLowerCase().contains(lowerKeyword)) {
            score += 10.0;
            // Bonus nếu match ở đầu
            if (product.getName().toLowerCase().startsWith(lowerKeyword)) {
                score += 5.0;
            }
            // Bonus nếu match exact
            if (product.getName().equalsIgnoreCase(keyword)) {
                score += 10.0;
            }
        }

        // Tags match
        if (product.getTags() != null && product.getTags().toLowerCase().contains(lowerKeyword)) {
            score += 5.0;
        }

        // Description match
        if (product.getDescription() != null && product.getDescription().toLowerCase().contains(lowerKeyword)) {
            score += 3.0;
        }

        // Meta keywords match
        if (product.getMetaKeywords() != null && product.getMetaKeywords().toLowerCase().contains(lowerKeyword)) {
            score += 4.0;
        }

        // Brand match
        if (product.getBrandId() != null) {
            Brand brand = brandRepository.findById(product.getBrandId()).orElse(null);
            if (brand != null && brand.getName() != null &&
                    brand.getName().toLowerCase().contains(lowerKeyword)) {
                score += 7.0;
            }
        }

        // Category match
        if (product.getProductCategories() != null) {
            for (ProductCategory pc : product.getProductCategories()) {
                Category category = pc.getCategory();

                if (category != null && category.getName() != null &&
                        category.getName().toLowerCase().contains(lowerKeyword)) {
                    score += 5.0;
                    break;
                }
            }
        }


        // Bonus cho sản phẩm phổ biến
        if (product.getViewCount() != null && product.getViewCount() > 100) {
            score += 1.0;
        }
        if (product.getSoldCount() != null && product.getSoldCount() > 50) {
            score += 1.0;
        }

        return score;
    }

    /**
     * Tìm các trường đã match với keyword
     */
    private List<String> findMatchedFields(Product product, String keyword) {
        List<String> fields = new ArrayList<>();
        String lowerKeyword = keyword.toLowerCase();

        if (product.getName() != null && product.getName().toLowerCase().contains(lowerKeyword)) {
            fields.add("name");
        }
        if (product.getTags() != null && product.getTags().toLowerCase().contains(lowerKeyword)) {
            fields.add("tags");
        }
        if (product.getDescription() != null && product.getDescription().toLowerCase().contains(lowerKeyword)) {
            fields.add("description");
        }
        if (product.getBrandId() != null) {
            Brand brand = brandRepository.findById(product.getBrandId()).orElse(null);
            if (brand != null && brand.getName() != null &&
                    brand.getName().toLowerCase().contains(lowerKeyword)) {
                fields.add("brand");
            }
        }
        if (product.getProductCategories() != null) {
            for (ProductCategory pc : product.getProductCategories()) {
                Category category = pc.getCategory();

                if (category != null &&
                        category.getName() != null &&
                        category.getName().toLowerCase().contains(lowerKeyword)) {

                    fields.add("category");
                    break;
                }
            }
        }


        return fields;
    }

    /**
     * Highlight keyword trong text (thêm marker để FE highlight)
     */
    private String highlightKeyword(String text, String keyword) {
        if (text == null || keyword == null) {
            return text;
        }

        // Sử dụng regex để highlight (case-insensitive)
        return text.replaceAll("(?i)(" + keyword + ")", "<mark>$1</mark>");
    }

    /**
     * Tạo Pageable với sort order dựa trên request
     */
    private Pageable createPageable(ProductSearchRequest request) {
        Sort sort;

        String sortBy = request.getSortBy();
        if (sortBy == null || "relevance".equalsIgnoreCase(sortBy)) {
            // Sort by relevance score (đã được xử lý trong query)
            sort = Sort.unsorted();
        } else if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "basePrice");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "basePrice");
        } else if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            sort = Sort.unsorted();
        }

        return PageRequest.of(request.getPage(), request.getSize(), sort);
    }

    /**
     * Build Specification cho advanced search với filters
     */
    private Specification<Product> buildSearchSpecification(String keyword, ProductSearchRequest request) {
        Specification<Product> spec = Specification.allOf(hasStatus(ACTIVE));

        // Keyword filter
        if (keyword != null && !keyword.trim().isEmpty()) {
            String lowerKeyword = keyword.trim().toLowerCase();
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                return cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + lowerKeyword + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + lowerKeyword + "%"),
                        cb.like(cb.lower(root.get("tags")), "%" + lowerKeyword + "%"),
                        cb.like(cb.lower(root.get("metaKeywords")), "%" + lowerKeyword + "%")
                );
            });
        }

        // Price filter
        if (request.getMinPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("basePrice"), request.getMinPrice()));
        }
        if (request.getMaxPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("basePrice"), request.getMaxPrice()));
        }

        // Brand filter
        if (request.getBrandIds() != null && !request.getBrandIds().isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("brandId").in(request.getBrandIds()));
        }

        // Category filter
        if (request.getCategories() != null && !request.getCategories().isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                // Join qua bảng trung gian ProductCategory
                Join<Product, ProductCategory> pcJoin = root.join("productCategories", JoinType.INNER);
                Join<ProductCategory, Category> categoryJoin = pcJoin.join("category", JoinType.INNER);
                return cb.or(
                        categoryJoin.get("slug").in(request.getCategories()),
                        categoryJoin.get("name").in(request.getCategories())
                );
            });
        }

        // Tags filter
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                return cb.or(
                        request.getTags().stream()
                                .map(tag -> cb.like(cb.lower(root.get("tags")), "%" + tag.toLowerCase() + "%"))
                                .toArray(jakarta.persistence.criteria.Predicate[]::new)
                );
            });
        }

        // Colors filter (subquery)
        if (request.getColors() != null && !request.getColors().isEmpty()) {
            List<String> colorAttrNames = attributeRepository.findByType("Color")
                    .stream().map(Attribute::getName).toList();

            if (!colorAttrNames.isEmpty()) {
                spec = spec.and((root, query, cb) -> {
                    query.distinct(true);

                    Subquery<Long> sq = query.subquery(Long.class);
                    Root<ProductVariant> pv = sq.from(ProductVariant.class);
                    Join<ProductVariant, VariantAttributeValue> attrJoin = pv.join("attributeValues");

                    sq.select(pv.get("product").get("id"))
                            .where(
                                    cb.equal(pv.get("product"), root),
                                    attrJoin.get("attribute").get("name").in(colorAttrNames),
                                    cb.lower(attrJoin.get("attributeValue")).in(
                                            request.getColors().stream()
                                                    .map(String::toLowerCase)
                                                    .toList()
                                    )
                            );

                    return cb.exists(sq);
                });
            }
        }

        // Sizes filter (subquery)
        if (request.getSizes() != null && !request.getSizes().isEmpty()) {
            List<String> sizeAttrNames = attributeRepository.findByType("Size")
                    .stream().map(Attribute::getName).toList();

            if (!sizeAttrNames.isEmpty()) {
                spec = spec.and((root, query, cb) -> {
                    query.distinct(true);

                    Subquery<Long> sq = query.subquery(Long.class);
                    Root<ProductVariant> pv = sq.from(ProductVariant.class);
                    Join<ProductVariant, VariantAttributeValue> attrJoin = pv.join("attributeValues");

                    sq.select(pv.get("product").get("id"))
                            .where(
                                    cb.equal(pv.get("product"), root),
                                    attrJoin.get("attribute").get("name").in(sizeAttrNames),
                                    attrJoin.get("attributeValue").in(request.getSizes())
                            );

                    return cb.exists(sq);
                });
            }
        }

        // In-stock filter
        if (request.getInStock() != null) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);

                Subquery<Long> sq = query.subquery(Long.class);
                Root<ProductVariant> pv = sq.from(ProductVariant.class);
                Join<ProductVariant, Stock> stockJoin = pv.join("stocks");

                sq.select(pv.get("product").get("id"))
                        .where(
                                cb.equal(pv.get("product"), root),
                                request.getInStock()
                                        ? cb.greaterThan(stockJoin.get("quantity"), 0)
                                        : cb.lessThanOrEqualTo(stockJoin.get("quantity"), 0)
                        );

                return cb.exists(sq);
            });
        }

        return spec;
    }



    /**
     * ADMIN: tạo product mới
     */
    @Transactional
    public ProductAdminDetailDto createProduct(CreateProductRequest request,
                                               List<MultipartFile> productImages) {

        Product product = new Product();
        applyProductBasicFields(product, request);

        // brand
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrandId(brand.getId());
        }

        // categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {

            // Xóa các mapping cũ
            product.getProductCategories().clear();

            // Lấy danh sách category
            var categories = categoryRepository.findAllById(request.getCategoryIds());

            // Tạo mapping mới ProductCategory
            for (Category category : categories) {
                ProductCategory pc = ProductCategory.builder()
                        .id(new ProductCategoryId(product.getId(), category.getId()))
                        .product(product)
                        .category(category)
                        .build();

                product.getProductCategories().add(pc);
            }
        }


        product.setViewCount(0);
        product.setSoldCount(0);

        Product saved = repo.save(product);

        // ⭐️ FIX: Validate ảnh với category (Nam/Nữ) trước khi upload
        String categoryGender = getCategoryGender(request.getCategoryIds());
        
        // Ảnh product
        if (productImages != null && !productImages.isEmpty()) {
            int sortOrder = 1;
            for (MultipartFile file : productImages) {
                if (file.isEmpty()) continue;
                
                // Validate giới tính trong ảnh
                if (categoryGender != null) {
                    String detectedGender = faceMatchService.detectGender(file);
                    if (detectedGender != null && !detectedGender.equals(categoryGender)) {
                        String genderText = categoryGender.equals("male") ? "nam" : "nữ";
                        String detectedText = detectedGender.equals("male") ? "nam" : "nữ";
                        throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            String.format("Ảnh không phù hợp! Sản phẩm thuộc danh mục %s nhưng ảnh phát hiện là %s. Vui lòng chọn ảnh phù hợp với danh mục.", 
                                genderText, detectedText)
                        );
                    }
                }
                
                String url = cloudinaryService.uploadFile(file, "products");
                ProductImage img = new ProductImage();
                img.setProduct(saved);
                img.setImageUrl(url);
                img.setAltText(saved.getName());
                img.setSortOrder(sortOrder++);
                img.setIsPrimary(sortOrder == 2);
                productImageRepository.save(img);
            }
        }

        // Tạo variants (optional)
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (CreateVariantRequest vReq : request.getVariants()) {
                createVariantInternal(saved, vReq);
            }
        }

        return getProductAdminDetail(saved.getId());
    }

    /**
     * ADMIN: update product
     */
    @Transactional
    public ProductAdminDetailDto updateProduct(Long id,
                                               UpdateProductRequest request,
                                               List<MultipartFile> newImages) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        applyProductBasicFields(product, request);

        // brand
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrandId(brand.getId());
        } else {
            product.setBrandId(null);
        }

        // categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            // Đảm bảo set không null
            if (product.getProductCategories() == null) {
                product.setProductCategories(new HashSet<>());
            } else {
                // Xoá mapping cũ để tránh bị dư/cũ
                product.getProductCategories().clear();
            }

            var categories = categoryRepository.findAllById(request.getCategoryIds());

            for (Category category : categories) {
                ProductCategory pc = ProductCategory.builder()
                        // Với @MapsId trong ProductCategory, có thể KHÔNG cần set id,
                        // chỉ cần set product + category là đủ
                        .product(product)
                        .category(category)
                        .build();

                product.getProductCategories().add(pc);
            }
        }


        Product saved = repo.save(product);

        // ⭐️ FIX: Validate ảnh với category (Nam/Nữ) trước khi upload
        String categoryGender = getCategoryGender(request.getCategoryIds());
        
        // Nếu có upload ảnh mới thì thêm vào (không xoá ảnh cũ ở đây,
        // FE có thể call API riêng để xoá ảnh)
        if (newImages != null && !newImages.isEmpty()) {
            int maxSort = productImageRepository.findMaxSortOrderByProductId(saved.getId()).orElse(0);
            int sortOrder = maxSort + 1;
            for (MultipartFile file : newImages) {
                if (file.isEmpty()) continue;
                
                // Validate giới tính trong ảnh
                if (categoryGender != null) {
                    String detectedGender = faceMatchService.detectGender(file);
                    if (detectedGender != null && !detectedGender.equals(categoryGender)) {
                        String genderText = categoryGender.equals("male") ? "nam" : "nữ";
                        String detectedText = detectedGender.equals("male") ? "nam" : "nữ";
                        throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            String.format("Ảnh không phù hợp! Sản phẩm thuộc danh mục %s nhưng ảnh phát hiện là %s. Vui lòng chọn ảnh phù hợp với danh mục.", 
                                genderText, detectedText)
                        );
                    }
                }
                
                String url = cloudinaryService.uploadFile(file, "products");
                ProductImage img = new ProductImage();
                img.setProduct(saved);
                img.setImageUrl(url);
                img.setAltText(saved.getName());
                img.setSortOrder(sortOrder++);
                img.setIsPrimary(false);
                productImageRepository.save(img);
            }
        }

        return getProductAdminDetail(saved.getId());
    }

    /**
     * ADMIN: xoá product
     * Có thể chọn soft delete (đổi status) hoặc hard delete.
     * Ở đây mình chọn soft: status = "deleted"
     */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus("deleted");
        repo.save(product);
    }

    /**
     * ADMIN: list product (có filter đơn giản)
     */
    @Transactional(readOnly = true)
    public Page<ProductAdminDetailDto> listProductsAdmin(
            String keyword,
            String status,
            Long brandId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // có thể dùng Specification, ở đây tạm filter đơn giản
        Page<Product> productPage = repo.findAll((root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("name")), like),
                                cb.like(cb.lower(root.get("slug")), like),
                                cb.like(cb.lower(root.get("tags")), like)
                        )
                );
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (brandId != null) {
                predicates.add(cb.equal(root.get("brandId"), brandId));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);

        List<ProductAdminDetailDto> dtos = productPage.getContent().stream()
                .map(p -> getProductAdminDetail(p.getId()))
                .toList();

        return new PageImpl<>(dtos, pageable, productPage.getTotalElements());
    }

    /**
     * ADMIN: xem chi tiết product
     */
    @Transactional(readOnly = true)
    public ProductAdminDetailDto getProductAdminDetail(Long id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String brandName = null;
        if (product.getBrandId() != null) {
            brandName = brandRepository.findById(product.getBrandId())
                    .map(Brand::getName).orElse(null);
        }

        List<Long> categoryIds = new ArrayList<>();
        List<String> categoryNames = new ArrayList<>();

        if (product.getProductCategories() != null) {
            product.getProductCategories().forEach(pc -> {
                Category c = pc.getCategory();
                if (c != null) {
                    categoryIds.add(c.getId());
                    categoryNames.add(c.getName());
                }
            });
        }

        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());

        List<ProductImage> productImages =
                productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId());
        List<ImageDto> imageDtos = productImages.stream()
                .map(img -> ImageDto.builder()
                        .id(img.getId())
                        .url(img.getImageUrl())
                        .alt(img.getAltText())
                        .sortOrder(img.getSortOrder())
                        .primary(Boolean.TRUE.equals(img.getIsPrimary()))
                        .hover(
                                !Boolean.TRUE.equals(img.getIsPrimary()) &&
                                        img.getSortOrder() != null &&
                                        img.getSortOrder() == 2
                        )
                        .build())
                .toList();


        // variants
        ;
        List<ProductVariantAdminDto> variantDtos = variants.stream()
                .map(this::toVariantAdminDto)
                .toList();

        return ProductAdminDetailDto.builder()
                .id(product.getId())
                .brandId(product.getBrandId())
                .brandName(brandName)
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .metaTitle(product.getMetaTitle())
                .metaDescription(product.getMetaDescription())
                .metaKeywords(product.getMetaKeywords())
                .tags(product.getTags())
                .material(product.getMaterial())
                .careInstructions(product.getCareInstructions())
                .countryOfOrigin(product.getCountryOfOrigin())
                .featured(product.getIsFeatured() != null && product.getIsFeatured())
                .basePrice(product.getBasePrice())
                .status(product.getStatus())
                .viewCount(product.getViewCount())
                .soldCount(product.getSoldCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .categoryIds(categoryIds)
                .categoryNames(categoryNames)
                .images(imageDtos)
                .variants(variantDtos)
                .build();
    }

    private ProductVariantAdminDto toVariantAdminDto(ProductVariant variant) {
        // stock
        Stock stock = stockRepository.findFirstByVariantId(variant.getId()).orElse(null);

        // attributes
        List<VariantAttributeValue> vavs =
                variantAttributeValueRepository.findByVariantId(variant.getId());
        List<VariantAttributePairDto> attributeDtos = vavs.stream().map(vav -> {
            Attribute attr = attributeRepository.findById(vav.getAttribute().getId())
                    .orElse(null);
            AttributeValue attrVal = attributeValueRepository.findById(vav.getAttributeValue().getId())
                    .orElse(null);

            return VariantAttributePairDto.builder()
                    .attributeId(attr != null ? attr.getId() : null)
                    .attributeName(attr != null ? attr.getName() : null)
                    .attributeValueId(attrVal != null ? attrVal.getId() : null)
                    .attributeValue(attrVal != null ? attrVal.getValue() : null)
                    .build();
        }).toList();

        // variant images
        List<VariantImage> vImages =
                variantImageRepository.findByVariantIdOrderBySortOrderAsc(variant.getId());
        List<ImageDto> imageDtos = vImages.stream()
                .map(img -> ImageDto.builder()
                        .id(img.getId())
                        .url(img.getImageUrl())
                        .alt(img.getAltText())
                        .sortOrder(img.getSortOrder())
                        .primary(Boolean.TRUE.equals(img.getIsPrimary()))
                        .hover(
                                !Boolean.TRUE.equals(img.getIsPrimary()) &&
                                        img.getSortOrder() != null &&
                                        img.getSortOrder() == 2
                        )
                        .build())
                .toList();

        return ProductVariantAdminDto.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .compareAtPrice(variant.getCompareAtPrice())
                .costPrice(variant.getCostPrice())
                .weightGram(variant.getWeightGram())
                .status(variant.getStatus())
                .isDefault(variant.getIsDefault() != null && variant.getIsDefault())
                .stockQuantity(stock != null ? stock.getQuantity() : 0)
                .safetyStock(stock != null ? stock.getSafetyStock() : null)
                .stockLocation(stock != null ? stock.getLocation() : null)
                .attributes(attributeDtos)
                .images(imageDtos)
                .build();
    }

    /**
     * ADMIN: tạo variant cho product
     */
    @Transactional
    public ProductVariantAdminDto createVariant(Long productId, CreateVariantRequest request,
                                                List<MultipartFile> images) {

        Product product = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = createVariantInternal(product, request);

        // images
        if (images != null && !images.isEmpty()) {
            int sort = 1;
            for (MultipartFile f : images) {
                if (f.isEmpty()) continue;
                String url = cloudinaryService.uploadFile(f, "variants");
                VariantImage vi = new VariantImage();
                vi.setVariant(variant);
                vi.setImageUrl(url);
                vi.setAltText(variant.getSku());
                vi.setSortOrder(sort++);
                vi.setIsPrimary(sort == 1);
                variantImageRepository.save(vi);
            }
        }

        return toVariantAdminDto(variant);
    }

    /**
     * ADMIN: update variant
     */
    @Transactional
    public ProductVariantAdminDto updateVariant(Long productId, Long variantId,
                                                UpdateVariantRequest request,
                                                List<MultipartFile> newImages) {

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Variant does not belong to product");
        }

        if (request.getSku() != null) variant.setSku(request.getSku());
        if (request.getPrice() != null) variant.setPrice(request.getPrice());
        if (request.getCompareAtPrice() != null) variant.setCompareAtPrice(request.getCompareAtPrice());
        if (request.getCostPrice() != null) variant.setCostPrice(request.getCostPrice());
        if (request.getWeightGram() != null) variant.setWeightGram(request.getWeightGram());
        if (request.getStatus() != null) variant.setStatus(request.getStatus());
        if (request.getIsDefault() != null) variant.setIsDefault(request.getIsDefault());

        productVariantRepository.save(variant);

        // update attributes (xoá cũ -> thêm mới)
        if (request.getAttributes() != null) {
            variantAttributeValueRepository.deleteByVariantId(variant.getId());

            for (VariantAttributeValueDto dto : request.getAttributes()) {

                VariantAttributeValueId vavId = new VariantAttributeValueId(
                        variant.getId(),
                        dto.getAttributeId(),
                        dto.getAttributeValueId()
                );

                VariantAttributeValue vav = new VariantAttributeValue();
                vav.setId(vavId);
                vav.setVariant(variant);
                vav.setAttribute(attributeRepository.getReferenceById(dto.getAttributeId()));
                vav.setAttributeValue(attributeValueRepository.getReferenceById(dto.getAttributeValueId()));

                variantAttributeValueRepository.save(vav);
            }
        }


        // add new images (không xoá cũ)
        if (newImages != null && !newImages.isEmpty()) {
            int maxSort = variantImageRepository.findMaxSortOrderByVariantId(variant.getId()).orElse(0);
            int sort = maxSort + 1;
            for (MultipartFile f : newImages) {
                if (f.isEmpty()) continue;
                String url = cloudinaryService.uploadFile(f, "variants");
                VariantImage vi = new VariantImage();
                vi.setVariant(variant);
                vi.setImageUrl(url);
                vi.setAltText(variant.getSku());
                vi.setSortOrder(sort++);
                vi.setIsPrimary(false);
                variantImageRepository.save(vi);
            }
        }

        return toVariantAdminDto(variant);
    }

    /**
     * ADMIN: xoá variant
     */
    @Transactional
    public void deleteVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Variant does not belong to product");
        }

        productVariantRepository.delete(variant); // cascade stocks, vav, variant_images
    }

    /**
     * ADMIN: update stock variant
     */
    @Transactional
    public ProductVariantAdminDto updateVariantStock(Long productId, Long variantId,
                                                     UpdateStockRequest request) {

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Variant does not belong to product");
        }

        Stock stock = stockRepository.findFirstByVariantId(variant.getId())
                .orElseGet(() -> {
                    Stock s = new Stock();
                    s.setVariant(variant);
                    s.setUpdatedAt(LocalDateTime.now());
                    return s;
                });

        if (request.getQuantity() != null) stock.setQuantity(request.getQuantity());
        if (request.getSafetyStock() != null) stock.setSafetyStock(request.getSafetyStock());
        if (request.getLocation() != null) stock.setLocation(request.getLocation());
        stock.setUpdatedAt(LocalDateTime.now());

        stockRepository.save(stock);

        return toVariantAdminDto(variant);
    }

    /**
     * ADMIN: xoá ảnh product
     */
    @Transactional
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage img = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));
        if (!img.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Image does not belong to product");
        }
        productImageRepository.delete(img);
    }

    /**
     * ADMIN: xoá ảnh variant
     */
    @Transactional
    public void deleteVariantImage(Long variantId, Long imageId) {
        VariantImage img = variantImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Variant image not found"));
        if (!img.getVariant().getId().equals(variantId)) {
            throw new RuntimeException("Image does not belong to variant");
        }
        variantImageRepository.delete(img);
    }

    // ================== PRIVATE HELPER ==================

    private void applyProductBasicFields(Product product, CreateProductRequest req) {
        product.setName(req.getName());
        product.setSlug(req.getSlug());
        product.setDescription(req.getDescription());
        product.setMetaTitle(req.getMetaTitle());
        product.setMetaDescription(req.getMetaDescription());
        product.setMetaKeywords(req.getMetaKeywords());
        product.setTags(req.getTags());
        product.setMaterial(req.getMaterial());
        product.setCareInstructions(req.getCareInstructions());
        product.setCountryOfOrigin(req.getCountryOfOrigin());
        product.setIsFeatured(req.getFeatured() != null && req.getFeatured());
        product.setBasePrice(req.getBasePrice());
        product.setStatus(req.getStatus());
    }

    private void applyProductBasicFields(Product product, UpdateProductRequest req) {
        if (req.getName() != null) product.setName(req.getName());
        if (req.getSlug() != null) product.setSlug(req.getSlug());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getMetaTitle() != null) product.setMetaTitle(req.getMetaTitle());
        if (req.getMetaDescription() != null) product.setMetaDescription(req.getMetaDescription());
        if (req.getMetaKeywords() != null) product.setMetaKeywords(req.getMetaKeywords());
        if (req.getTags() != null) product.setTags(req.getTags());
        if (req.getMaterial() != null) product.setMaterial(req.getMaterial());
        if (req.getCareInstructions() != null) product.setCareInstructions(req.getCareInstructions());
        if (req.getCountryOfOrigin() != null) product.setCountryOfOrigin(req.getCountryOfOrigin());
        if (req.getFeatured() != null) product.setIsFeatured(req.getFeatured());
        if (req.getBasePrice() != null) product.setBasePrice(req.getBasePrice());
        if (req.getStatus() != null) product.setStatus(req.getStatus());
    }

    private ProductVariant createVariantInternal(Product product, CreateVariantRequest req) {
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSku(req.getSku());
        variant.setPrice(req.getPrice());
        variant.setCompareAtPrice(req.getCompareAtPrice());
        variant.setCostPrice(req.getCostPrice());
        variant.setWeightGram(req.getWeightGram());
        variant.setStatus(req.getStatus());
        variant.setCreatedAt(LocalDateTime.now());
        variant.setIsDefault(false);

        ProductVariant savedVariant = productVariantRepository.save(variant);

        // attributes
        if (req.getAttributes() != null) {
            for (VariantAttributeValueDto dto : req.getAttributes()) {

                // Tạo khóa chính tổng hợp
                VariantAttributeValueId vavId = new VariantAttributeValueId(
                        savedVariant.getId(),      // variantId
                        dto.getAttributeId(),      // attributeId
                        dto.getAttributeValueId()  // attributeValueId
                );

                VariantAttributeValue vav = new VariantAttributeValue();
                vav.setId(vavId);
                vav.setVariant(savedVariant);
                vav.setAttribute(attributeRepository.getReferenceById(dto.getAttributeId()));
                vav.setAttributeValue(attributeValueRepository.getReferenceById(dto.getAttributeValueId()));

                variantAttributeValueRepository.save(vav);
            }
        }

        // stock
        Stock stock = new Stock();
        stock.setVariant(savedVariant);
        stock.setQuantity(req.getInitialStock() != null ? req.getInitialStock() : 0);
        stock.setSafetyStock(req.getSafetyStock() != null ? req.getSafetyStock() : 0);
        stock.setLocation(req.getStockLocation());
        stock.setUpdatedAt(LocalDateTime.now());
        stockRepository.save(stock);

        return savedVariant;
    }

    /**
     * Xác định giới tính của category (Nam/Nữ)
     * @param categoryIds Danh sách category IDs
     * @return "male" nếu thuộc Nam (id=8), "female" nếu thuộc Nữ (id=9), null nếu không phải Nam/Nữ
     */
    private String getCategoryGender(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return null;
        }

        // Lấy tất cả categories
        var categories = categoryRepository.findAllById(categoryIds);
        
        for (Category category : categories) {
            // Kiểm tra category cha (Nam id=8, Nữ id=9)
            Long parentId = category.getParentId();
            if (parentId != null) {
                if (parentId == 8L) { // Nam
                    return "male";
                } else if (parentId == 9L) { // Nữ
                    return "female";
                }
            }
            
            // Kiểm tra chính category đó (nếu là root category)
            if (category.getId() == 8L) { // Nam
                return "male";
            } else if (category.getId() == 9L) { // Nữ
                return "female";
            }
        }
        
        return null; // Không phải Nam/Nữ
    }

    /**
     * Validate ảnh model với productId (dùng cho Virtual Try-On)
     * @param productId ID của sản phẩm
     * @param imageFile File ảnh model cần validate
     * @return true nếu hợp lệ, false nếu không hợp lệ
     * @throws RuntimeException nếu product không tồn tại
     */
    @Transactional(readOnly = true)
    public boolean validateModelImageForProduct(Long productId, MultipartFile imageFile) {
        log.info("=== Validating model image for product {} ===", productId);
        
        // Kiểm tra product có tồn tại không
        if (!repo.existsById(productId)) {
            log.error("Product {} not found", productId);
            throw new RuntimeException("Product not found");
        }

        // Lấy categoryIds từ ProductCategoryRepository
        List<ProductCategory> productCategories = productCategoryRepository.findById_ProductId(productId);
        List<Long> categoryIds = new ArrayList<>();
        for (ProductCategory pc : productCategories) {
            if (pc.getCategory() != null) {
                categoryIds.add(pc.getCategory().getId());
                log.info("Product {} has category: {} (id={})", 
                        productId, pc.getCategory().getName(), pc.getCategory().getId());
            }
        }

        log.info("Product {} has {} categories: {}", productId, categoryIds.size(), categoryIds);

        // Nếu không có category thì không cần validate
        if (categoryIds.isEmpty()) {
            log.info("Product {} has no categories, allowing upload", productId);
            return true;
        }

        // Lấy gender từ category
        String categoryGender = getCategoryGender(categoryIds);
        log.info("Category gender for product {}: {}", productId, categoryGender);

        // Nếu category không phải Nam/Nữ thì không cần validate
        if (categoryGender == null) {
            log.info("Product {} category is not gender-specific, allowing upload", productId);
            return true;
        }

        // Validate ảnh với FaceMatchService
        boolean isValid = faceMatchService.validateImageGender(imageFile, categoryGender);
        log.info("Validation result for product {}: {}", productId, isValid ? "VALID" : "INVALID");
        
        return isValid;
    }

}
