package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.service.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/virtual-tryon")
@RequiredArgsConstructor
@Tag(name = "Virtual Try-On Upload", description = "Upload model images for virtual try-on")
public class VirtualTryOnUploadController {

    private final CloudinaryService cloudinaryService;
    private final ProductService productService;

    @PostMapping("/upload-model")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload ảnh người dùng cho tính năng thử đồ ảo")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadModelImage(
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File size must be less than 5MB");
        }

        String[] allowedTypes = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"};
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (contentType.equals(type)) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            throw new BadRequestException("Image format not supported. Allowed: JPEG, PNG, GIF, WEBP");
        }

        String url = cloudinaryService.uploadFile(file, "virtual-tryon-models");
        if (url == null || url.isEmpty()) {
            throw new BadRequestException("Failed to upload image to Cloudinary");
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
    }

    @PostMapping("/validate-model-image")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Validate ảnh model với productId (kiểm tra giới tính)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateModelImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId
    ) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image");
        }

        try {
            boolean isValid = productService.validateModelImageForProduct(productId, file);
            
            if (!isValid) {
                // Lấy category gender để hiển thị thông báo
                // (có thể lấy từ product, nhưng để đơn giản thì chỉ trả về lỗi)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<Map<String, Object>>builder()
                                .success(false)
                                .message("Ảnh không phù hợp! Vui lòng chọn ảnh phù hợp với giới tính của sản phẩm.")
                                .data(Map.of("valid", false))
                                .timestamp(System.currentTimeMillis())
                                .build());
            }

            return ResponseEntity.ok(ApiResponse.success(Map.of("valid", true)));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                throw new BadRequestException("Product not found");
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Lỗi khi kiểm tra ảnh: " + e.getMessage());
        }
    }
}


