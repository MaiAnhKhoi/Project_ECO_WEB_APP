package com.tlcn.fashion_api.service.wishlist;

import com.tlcn.fashion_api.dto.request.WishlistItemRequest;
import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.entity.wishlist.Wishlist;
import com.tlcn.fashion_api.entity.wishlist.WishlistItem;
import com.tlcn.fashion_api.mapper.product.ProductCardMapper;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.ProductVariantRepository;
import com.tlcn.fashion_api.repository.wishlist.WishlistItemRepository;
import com.tlcn.fashion_api.repository.wishlist.WishlistRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tlcn.fashion_api.security.SecurityUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepo;
    private final WishlistItemRepository wishlistItemRepo;
    private final ProductRepository productRepo;
    private final ProductVariantRepository variantRepo;
    private final ProductCardMapper productMapper;

    private static final int DEFAULT_PAGE_SIZE = 16;

    @Transactional(readOnly = true)
    public Page<ProductCardResponse> getMyWishlist(int page, Integer size) {
        int pageSize = (size == null || size <= 0) ? DEFAULT_PAGE_SIZE : size;

        Long userId = SecurityUtils.getCurrentUserId();

        PageRequest pageable = PageRequest.of(page, pageSize);
        Page<Product> productPage = productRepo.findWishlistProductsByUserId(userId, pageable);

        List<ProductCardResponse> content = productMapper.toList(productPage.getContent());

        return new PageImpl<>(
                content,
                productPage.getPageable(),
                productPage.getTotalElements()
        );
    }

    @Transactional
    public void addToMyWishlist(WishlistItemRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();

        // 1. Tìm hoặc tạo wishlist cho user
        Wishlist wishlist = wishlistRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Wishlist w = new Wishlist();
                    User u = new User();
                    u.setId(userId);
                    w.setUser(u);
                    return wishlistRepo.save(w);
                });

        // 2. Lấy product & variant (nếu có)
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductVariant variant = null;
        if (req.getVariantId() != null) {
            variant = variantRepo.findById(req.getVariantId())
                    .orElseThrow(() -> new EntityNotFoundException("Variant not found"));
        }

        // 3. Check đã tồn tại (tôn trọng UNIQUE uq_wli)
        boolean exists;
        if (variant == null) {
            exists = wishlistItemRepo.existsByWishlistIdAndProductIdAndVariantIsNull(
                    wishlist.getId(),
                    product.getId()
            );
        } else {
            exists = wishlistItemRepo.existsByWishlistIdAndProductIdAndVariantId(
                    wishlist.getId(),
                    product.getId(),
                    variant.getId()
            );
        }

        if (exists) {
            // đã có trong wishlist thì thôi, không thêm nữa
            return;
        }

        // 4. Tạo mới WishlistItem
        WishlistItem item = new WishlistItem();
        item.setWishlist(wishlist);
        item.setProduct(product);
        item.setVariant(variant);

        wishlistItemRepo.save(item);
    }

    @Transactional
    public void removeFromMyWishlist(Long productId, Long variantId) {
        Long userId = SecurityUtils.getCurrentUserId();

        Wishlist wishlist = wishlistRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Wishlist not found"));

        int affected;
        if (variantId == null) {
            // ❗ XOÁ TẤT CẢ ITEM CỦA PRODUCT, KHÔNG QUAN TÂM VARIANT
            affected = wishlistItemRepo.deleteByWishlistIdAndProductId(
                    wishlist.getId(), productId
            );
        } else {
            affected = wishlistItemRepo.deleteByWishlistIdAndProductIdAndVariantId(
                    wishlist.getId(), productId, variantId
            );
        }
    }
}