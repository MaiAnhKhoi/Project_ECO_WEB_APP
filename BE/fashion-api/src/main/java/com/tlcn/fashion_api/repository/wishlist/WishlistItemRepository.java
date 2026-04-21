package com.tlcn.fashion_api.repository.wishlist;

import com.tlcn.fashion_api.entity.wishlist.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    boolean existsByWishlistIdAndProductIdAndVariantId(Long wishlistId, Long productId, Long variantId);

    boolean existsByWishlistIdAndProductIdAndVariantIsNull(Long wishlistId, Long productId);

    @Modifying
    int deleteByWishlistIdAndProductIdAndVariantId(Long wishlistId, Long productId, Long variantId);

    @Modifying
    int deleteByWishlistIdAndProductIdAndVariantIsNull(Long wishlistId, Long productId);
    int deleteByWishlistIdAndProductId(Long wishlistId, Long productId);
}
