// com.tlcn.fashion_api.controller.admin.BannerAdminController
package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.banner.CreateBannerRequest;
import com.tlcn.fashion_api.dto.request.banner.UpdateBannerRequest;
import com.tlcn.fashion_api.dto.response.banner.BannerAdminDto;
import com.tlcn.fashion_api.service.banner.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController("adminBannerController")
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
@Tag(name = "Banner Management", description = "Banner management APIs (Admin & Marketing Staff)")
public class BannerControllerAdmin {

    private final BannerService bannerService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "List banners")
    public ResponseEntity<ApiResponse<PageResponse<BannerAdminDto>>> listBanners(
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<BannerAdminDto> pageData = bannerService
                .listBanners(position, active, keyword, page, size);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(pageData)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Get banner detail")
    public ResponseEntity<ApiResponse<BannerAdminDto>> getBannerDetail(@PathVariable Long id) {
        BannerAdminDto dto = bannerService.getBannerDetail(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Create banner")
    public ResponseEntity<ApiResponse<BannerAdminDto>> createBanner(
            @Valid @RequestPart("data") CreateBannerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "banners");
            request.setImageUrl(imageUrl);
        }

        BannerAdminDto dto = bannerService.createBanner(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Banner created successfully"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Update banner")
    public ResponseEntity<ApiResponse<BannerAdminDto>> updateBanner(
            @PathVariable Long id,
            @Valid @RequestPart("data") UpdateBannerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "banners");
            request.setImageUrl(imageUrl);
        }

        BannerAdminDto dto = bannerService.updateBanner(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Banner updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Delete banner")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Banner deleted"));
    }

    @PatchMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Toggle active status")
    public ResponseEntity<ApiResponse<BannerAdminDto>> updateActive(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        BannerAdminDto dto = bannerService.updateActive(id, active);
        return ResponseEntity.ok(ApiResponse.success(dto, "Banner active state updated"));
    }
}
