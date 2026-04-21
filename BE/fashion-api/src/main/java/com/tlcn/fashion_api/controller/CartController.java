package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.cart.AddCartItemRequest;
import com.tlcn.fashion_api.dto.request.cart.UpdateCartItemRequest;
import com.tlcn.fashion_api.dto.response.cart.CartResponse;
import com.tlcn.fashion_api.service.cart.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart/my
    @GetMapping("/my")
    public CartResponse getMyCart() {
        return cartService.getMyCart();
    }

    // POST /api/cart/items
    @PostMapping("/items")
    public CartResponse addItem(@Valid @RequestBody AddCartItemRequest req) {
        return cartService.addItem(req);
    }

    // PATCH /api/cart/items/{id}
    @PatchMapping("/items/{id}")
    public CartResponse updateItem(
            @PathVariable Long id,
            @RequestBody UpdateCartItemRequest req
    ) {
        return cartService.updateItem(id, req);
    }

    // DELETE /api/cart/items/{id}
    @DeleteMapping("/items/{id}")
    public CartResponse removeItem(@PathVariable Long id) {
        return cartService.removeItem(id);
    }
}
