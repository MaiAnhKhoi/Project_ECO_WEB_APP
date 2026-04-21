package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.brand.CreateBrandRequest;
import com.tlcn.fashion_api.dto.request.brand.UpdateBrandRequest;
import com.tlcn.fashion_api.dto.response.brand.BrandDto;
import com.tlcn.fashion_api.service.product.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController("adminBrandController")
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
@Tag(name = "Brand Management", description = "Brand management APIs (Admin & Product Manager)")
public class BrandControllerAdmin {

    private final BrandService brandService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Get all brands with pagination")
    public ResponseEntity<ApiResponse<PageResponse<BrandDto>>> getAllBrandsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BrandDto> brands = brandService.getAllBrandsAdmin(pageable);
        PageResponse<BrandDto> response = PageResponse.of(brands);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Get brand by ID (Admin)")
    public ResponseEntity<ApiResponse<BrandDto>> getBrandById(@PathVariable Long id) {
        BrandDto brand = brandService.getBrandById(id);
        return ResponseEntity.ok(ApiResponse.success(brand));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create brand (Admin)")
    public ResponseEntity<ApiResponse<BrandDto>> createBrand(
            @Valid @RequestPart("data") CreateBrandRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        // Upload ảnh lên Cloudinary (nếu có)
        String imageUrl = cloudinaryService.uploadFile(imageFile, "brands");
        request.setImageUrl(imageUrl);

        BrandDto brand = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(brand, "Brand created successfully"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update brand (Admin)")
    public ResponseEntity<ApiResponse<BrandDto>> updateBrand(
            @PathVariable Long id,
            @Valid @RequestPart("data") UpdateBrandRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        // Nếu có upload ảnh mới thì update imageUrl
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "brands");
            request.setImageUrl(imageUrl);
        }

        BrandDto brand = brandService.updateBrand(id, request);
        return ResponseEntity.ok(ApiResponse.success(brand, "Brand updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete brand (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Brand deleted successfully"));
    }
}
