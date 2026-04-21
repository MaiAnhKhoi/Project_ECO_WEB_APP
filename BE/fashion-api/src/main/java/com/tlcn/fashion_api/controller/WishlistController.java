package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.WishlistItemRequest;
import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import com.tlcn.fashion_api.service.wishlist.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // GET /api/wishlist?page=0&size=16
    @GetMapping
    public Page<ProductCardResponse> getMyWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        return wishlistService.getMyWishlist(page, size);
    }

    // POST /api/wishlist
    // Body: { "productId": 123, "variantId": 456 } (variantId có thể null)
    @PostMapping
    public ResponseEntity<Void> addToWishlist(@RequestBody WishlistItemRequest request) {
        wishlistService.addToMyWishlist(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // DELETE /api/wishlist?productId=123&variantId=456 (variantId optional)
    @DeleteMapping
    public ResponseEntity<Void> removeFromWishlist(
            @RequestParam Long productId,
            @RequestParam(required = false) Long variantId
    ) {
        wishlistService.removeFromMyWishlist(productId, variantId);
        return ResponseEntity.noContent().build();
    }
}
