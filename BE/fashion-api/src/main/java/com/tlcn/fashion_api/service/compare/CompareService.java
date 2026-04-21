package com.tlcn.fashion_api.service.compare;

import com.tlcn.fashion_api.dto.response.compare.CompareResponse;
import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import com.tlcn.fashion_api.entity.compare.ComparisonItem;
import com.tlcn.fashion_api.entity.compare.ProductComparison;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.mapper.product.ProductCardMapper;
import com.tlcn.fashion_api.repository.compare.ComparisonItemRepository;
import com.tlcn.fashion_api.repository.compare.ProductComparisonRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompareService {

    private final ProductComparisonRepository comparisonRepository;
    private final ComparisonItemRepository itemRepository;
    private final ProductRepository productRepository;
    private final ProductCardMapper productMapper;

    private static final int MAX_COMPARE_ITEMS = 10; // Giới hạn số sản phẩm so sánh

    /**
     * Lấy danh sách sản phẩm so sánh của user hiện tại
     */
    @Transactional(readOnly = true)
    public CompareResponse getMyCompare() {
        Long userId = SecurityUtils.getCurrentUserIdOrNull();

        // Nếu chưa đăng nhập, trả về empty
        if (userId == null) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        ProductComparison comparison = comparisonRepository.findByUserId(userId)
                .orElse(null);

        if (comparison == null || comparison.getItems().isEmpty()) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        List<Product> products = comparison.getItems().stream()
                .map(ComparisonItem::getProduct)
                .collect(Collectors.toList());

        List<ProductCardResponse> productResponses = productMapper.toList(products);

        return CompareResponse.builder()
                .comparisonId(comparison.getId())
                .comparisonName(comparison.getComparisonName())
                .products(productResponses)
                .totalItems(productResponses.size())
                .build();
    }

    /**
     * Thêm sản phẩm vào danh sách so sánh
     */
    @Transactional
    public CompareResponse addProduct(Long productId) {
        Long userId = SecurityUtils.getCurrentUserIdOrNull();

        // Nếu chưa đăng nhập, trả về empty (frontend sẽ dùng localStorage)
        if (userId == null) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Tìm hoặc tạo comparison cho user
        ProductComparison comparison = comparisonRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ProductComparison newComparison = ProductComparison.builder()
                            .user(User.builder().id(userId).build())
                            .comparisonName("So sánh sản phẩm")
                            .build();
                    return comparisonRepository.save(newComparison);
                });

        // Kiểm tra đã có trong compare chưa
        if (itemRepository.findByComparisonIdAndProductId(comparison.getId(), productId).isPresent()) {
            throw new RuntimeException("Sản phẩm đã có trong danh sách so sánh");
        }

        // Kiểm tra số lượng tối đa
        long currentCount = itemRepository.countByComparisonId(comparison.getId());
        if (currentCount >= MAX_COMPARE_ITEMS) {
            throw new RuntimeException("Bạn chỉ có thể so sánh tối đa " + MAX_COMPARE_ITEMS + " sản phẩm");
        }

        // Thêm sản phẩm vào compare
        ComparisonItem item = ComparisonItem.builder()
                .comparison(comparison)
                .product(product)
                .sortOrder((int) currentCount + 1)
                .build();
        itemRepository.save(item);

        return getMyCompare();
    }

    /**
     * Xóa sản phẩm khỏi danh sách so sánh
     */
    @Transactional
    public CompareResponse removeProduct(Long productId) {
        Long userId = SecurityUtils.getCurrentUserIdOrNull();

        // Nếu chưa đăng nhập, trả về empty (frontend sẽ dùng localStorage)
        if (userId == null) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        ProductComparison comparison = comparisonRepository.findByUserId(userId)
                .orElse(null);

        if (comparison == null) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        ComparisonItem item = itemRepository.findByComparisonIdAndProductId(comparison.getId(), productId)
                .orElse(null);

        if (item != null) {
            itemRepository.delete(item);
        }

        return getMyCompare();
    }

    /**
     * Xóa tất cả sản phẩm khỏi danh sách so sánh
     */
    @Transactional
    public CompareResponse clearAll() {
        Long userId = SecurityUtils.getCurrentUserIdOrNull();

        // Nếu chưa đăng nhập, trả về empty (frontend sẽ dùng localStorage)
        if (userId == null) {
            return CompareResponse.builder()
                    .comparisonId(null)
                    .comparisonName(null)
                    .products(List.of())
                    .totalItems(0)
                    .build();
        }

        ProductComparison comparison = comparisonRepository.findByUserId(userId)
                .orElse(null);

        if (comparison != null) {
            itemRepository.deleteAll(comparison.getItems());
        }

        return getMyCompare();
    }
}