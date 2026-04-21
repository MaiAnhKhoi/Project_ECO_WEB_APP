package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.contact.ContactMessageStatusUpdateRequest;
import com.tlcn.fashion_api.dto.response.contact.ContactMessageAdminDto;
import com.tlcn.fashion_api.service.contact.ContactMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
@Tag(name = "Contact Messages", description = "Manage contact messages from customers")
@PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
public class ContactMessageAdminController {

    private final ContactMessageService contactMessageService;

    @GetMapping
    @Operation(summary = "List contact messages")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageAdminDto>>> listMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        PageResponse<ContactMessageAdminDto> response =
                contactMessageService.getMessages(page, size, status, keyword);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contact message detail")
    public ResponseEntity<ApiResponse<ContactMessageAdminDto>> getMessage(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contactMessageService.getDetail(id)));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update contact message status")
    public ResponseEntity<ApiResponse<ContactMessageAdminDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ContactMessageStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(contactMessageService.updateStatus(id, request)));
    }
}

