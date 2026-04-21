package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.response.compare.CompareResponse;
import com.tlcn.fashion_api.service.compare.CompareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
@RequiredArgsConstructor
@Tag(name = "Product Comparison", description = "API so sánh sản phẩm")
public class CompareController {

    private final CompareService compareService;

    @GetMapping("/my")
    @Operation(summary = "Lấy danh sách sản phẩm so sánh")
    public ResponseEntity<ApiResponse<CompareResponse>> getMyCompare() {
        CompareResponse response = compareService.getMyCompare();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/products/{productId}")
    @Operation(summary = "Thêm sản phẩm vào danh sách so sánh")
    public ResponseEntity<ApiResponse<CompareResponse>> addProduct(@PathVariable Long productId) {
        CompareResponse response = compareService.addProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(response, "Đã thêm sản phẩm vào danh sách so sánh"));
    }

    @DeleteMapping("/products/{productId}")
    @Operation(summary = "Xóa sản phẩm khỏi danh sách so sánh")
    public ResponseEntity<ApiResponse<CompareResponse>> removeProduct(@PathVariable Long productId) {
        CompareResponse response = compareService.removeProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(response, "Đã xóa sản phẩm khỏi danh sách so sánh"));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Xóa tất cả sản phẩm khỏi danh sách so sánh")
    public ResponseEntity<ApiResponse<CompareResponse>> clearAll() {
        CompareResponse response = compareService.clearAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Đã xóa tất cả sản phẩm khỏi danh sách so sánh"));
    }
}