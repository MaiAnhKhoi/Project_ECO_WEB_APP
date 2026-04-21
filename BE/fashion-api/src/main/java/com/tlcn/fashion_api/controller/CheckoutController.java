package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.order.CheckoutRequest;
import com.tlcn.fashion_api.dto.response.order.CheckoutResponse;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.order.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(
            @RequestBody CheckoutRequest request
    ) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(checkoutService.checkout(request, userId));
    }
}
