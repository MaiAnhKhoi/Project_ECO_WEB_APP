package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.response.product.AttributeDto;
import com.tlcn.fashion_api.dto.response.product.AttributeValueDto;
import com.tlcn.fashion_api.dto.response.product.CreateAttributeRequest;
import com.tlcn.fashion_api.dto.response.product.CreateAttributeValueRequest;
import com.tlcn.fashion_api.service.product.AttributeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/attributes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
public class AttributeControllerAdmin {

    private final AttributeService attributeService;

    // ================================
    // GET ALL
    // ================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttributeDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(attributeService.getAllWithValues()));
    }

    // ================================
    // CREATE ATTRIBUTE
    // ================================
    @PostMapping
    public ResponseEntity<ApiResponse<AttributeDto>> create(
            @RequestBody @Valid CreateAttributeRequest request) {

        AttributeDto dto = attributeService.createAttribute(request);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // ================================
    // UPDATE ATTRIBUTE
    // ================================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeDto>> update(
            @PathVariable Long id,
            @RequestBody @Valid CreateAttributeRequest request) {

        AttributeDto dto = attributeService.updateAttribute(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // ================================
    // CREATE ATTRIBUTE VALUE
    // ================================
    @PostMapping("/{attributeId}/values")
    public ResponseEntity<ApiResponse<AttributeValueDto>> createValue(
            @PathVariable Long attributeId,
            @RequestBody @Valid CreateAttributeValueRequest request) {

        AttributeValueDto dto = attributeService.createAttributeValue(attributeId, request);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // ================================
    // UPDATE ATTRIBUTE VALUE
    // ================================
    @PutMapping("/values/{valueId}")
    public ResponseEntity<ApiResponse<AttributeValueDto>> updateValue(
            @PathVariable Long valueId,
            @RequestBody @Valid CreateAttributeValueRequest request) {

        AttributeValueDto dto = attributeService.updateAttributeValue(valueId, request);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // ================================
    // DELETE ATTRIBUTE
    // ================================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttribute(@PathVariable Long id) {
        attributeService.deleteAttribute(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // ================================
    // DELETE ATTRIBUTE VALUE
    // ================================
    @DeleteMapping("/values/{valueId}")
    public ResponseEntity<ApiResponse<Void>> deleteValue(@PathVariable Long valueId) {
        attributeService.deleteAttributeValue(valueId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeDto>> getById(@PathVariable Long id) {
        AttributeDto dto = attributeService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
