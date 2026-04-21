package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.entity.vton.VirtualTryOnHistory;
import com.tlcn.fashion_api.repository.vton.VirtualTryOnHistoryRepository;
import com.tlcn.fashion_api.service.vton.VirtualTryOnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/virtual-tryon")
@RequiredArgsConstructor
@Tag(name = "Virtual Try-On", description = "AI virtual try-on APIs")
public class VirtualTryOnController {

    private final VirtualTryOnService virtualTryOnService;
    private final VirtualTryOnHistoryRepository historyRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Thử đồ ảo cho sản phẩm")
    public ResponseEntity<ApiResponse<VirtualTryOnHistory>> tryOn(
            @Valid @RequestBody TryOnRequest request
    ) {
        VirtualTryOnHistory history = virtualTryOnService.tryOn(
                request.getProductId(),
                request.getVariantId(),
                request.getCategory(),
                request.getModelImageUrl(),
                request.getGarmentImageUrl()
        );
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy lịch sử thử đồ của sản phẩm hiện tại")
    public ResponseEntity<ApiResponse<List<VirtualTryOnHistory>>> getHistory(@RequestParam Long productId) {
        Long userId = com.tlcn.fashion_api.security.SecurityUtils.getCurrentUserId();
        List<VirtualTryOnHistory> histories =
                historyRepository.findTop10ByUserIdAndProductIdOrderByCreatedAtDesc(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(histories));
    }

    @Data
    public static class TryOnRequest {

        @NotNull
        private Long productId;

        private Long variantId;

        @NotBlank
        private String category; // "upper_body" | "lower_body" | "dresses"

        @NotBlank
        private String modelImageUrl;   // ảnh người

        @NotBlank
        private String garmentImageUrl; // ảnh áo / quần / đầm
    }
}
