// com.tlcn.fashion_api.controller.admin.ProductControllerAdmin
package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.product.*;
import com.tlcn.fashion_api.dto.response.product.ProductAdminDetailDto;
import com.tlcn.fashion_api.dto.response.product.ProductVariantAdminDto;
import com.tlcn.fashion_api.service.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController("adminProductController")
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "Product management APIs (Admin & Product Manager)")
public class ProductControllerAdmin {

    private final ProductService productService;

    // --------- PRODUCT ---------

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "List products (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<ProductAdminDetailDto>>> listProductsAdmin(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long brandId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ProductAdminDetailDto> pageData = productService.listProductsAdmin(
                keyword, status, brandId, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(pageData)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Get product detail (Admin)")
    public ResponseEntity<ApiResponse<ProductAdminDetailDto>> getProductDetailAdmin(
            @PathVariable Long id
    ) {
        ProductAdminDetailDto dto = productService.getProductAdminDetail(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create product (Admin)")
    public ResponseEntity<ApiResponse<ProductAdminDetailDto>> createProduct(
            @Valid @RequestPart("data") CreateProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> productImages
    ) {
        ProductAdminDetailDto dto = productService.createProduct(request, productImages);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Product created successfully"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update product (Admin)")
    public ResponseEntity<ApiResponse<ProductAdminDetailDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("data") UpdateProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages
    ) {
        ProductAdminDetailDto dto = productService.updateProduct(id, request, newImages);
        return ResponseEntity.ok(ApiResponse.success(dto, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete product (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted (soft)"));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete product image (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(
            @PathVariable Long id,
            @PathVariable Long imageId
    ) {
        productService.deleteProductImage(id, imageId);
        return ResponseEntity.ok(ApiResponse.success(null, "Product image deleted"));
    }

    // --------- VARIANTS ---------

    @PostMapping(value = "/{productId}/variants", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create variant for product (Admin)")
    public ResponseEntity<ApiResponse<ProductVariantAdminDto>> createVariant(
            @PathVariable Long productId,
            @Valid @RequestPart("data") CreateVariantRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        ProductVariantAdminDto dto = productService.createVariant(productId, request, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Variant created successfully"));
    }

    @PutMapping(value = "/{productId}/variants/{variantId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update variant (Admin)")
    public ResponseEntity<ApiResponse<ProductVariantAdminDto>> updateVariant(
            @PathVariable Long productId,
            @PathVariable Long variantId,
            @Valid @RequestPart("data") UpdateVariantRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages
    ) {
        ProductVariantAdminDto dto = productService.updateVariant(productId, variantId, request, newImages);
        return ResponseEntity.ok(ApiResponse.success(dto, "Variant updated successfully"));
    }

    @DeleteMapping("/{productId}/variants/{variantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete variant (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteVariant(
            @PathVariable Long productId,
            @PathVariable Long variantId
    ) {
        productService.deleteVariant(productId, variantId);
        return ResponseEntity.ok(ApiResponse.success(null, "Variant deleted"));
    }

    @PatchMapping("/{productId}/variants/{variantId}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update variant stock (Admin)")
    public ResponseEntity<ApiResponse<ProductVariantAdminDto>> updateVariantStock(
            @PathVariable Long productId,
            @PathVariable Long variantId,
            @RequestBody UpdateStockRequest request
    ) {
        ProductVariantAdminDto dto = productService.updateVariantStock(productId, variantId, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Variant stock updated"));
    }

    @DeleteMapping("/variants/{variantId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete variant image (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteVariantImage(
            @PathVariable Long variantId,
            @PathVariable Long imageId
    ) {
        productService.deleteVariantImage(variantId, imageId);
        return ResponseEntity.ok(ApiResponse.success(null, "Variant image deleted"));
    }
}
