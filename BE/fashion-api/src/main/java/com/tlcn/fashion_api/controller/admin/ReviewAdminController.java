package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.review.ReviewStatusUpdateRequest;
import com.tlcn.fashion_api.dto.response.review.ReviewAdminDto;
import com.tlcn.fashion_api.service.review.ReviewAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "Review Management", description = "Manage product reviews for Admin & Customer Service")
public class ReviewAdminController {

    private final ReviewAdminService reviewAdminService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "List product reviews")
    public ResponseEntity<ApiResponse<PageResponse<ReviewAdminDto>>> listReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Byte rating,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        PageResponse<ReviewAdminDto> response = reviewAdminService.listReviews(
                page, size, productId, rating, status, keyword
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Get review detail")
    public ResponseEntity<ApiResponse<ReviewAdminDto>> getReview(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewAdminService.getDetail(id)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Update review status")
    public ResponseEntity<ApiResponse<ReviewAdminDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewAdminService.updateStatus(id, request)));
    }
}

