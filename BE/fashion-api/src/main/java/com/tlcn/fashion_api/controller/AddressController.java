package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.AddressRequest;
import com.tlcn.fashion_api.dto.response.address.AddressResponse;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.address.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(addressService.getMyAddresses(userId));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(addressService.createAddress(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(addressService.updateAddress(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        addressService.deleteAddress(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefault(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(addressService.setDefaultAddress(userId, id));
    }

    @GetMapping("/default")
    public ResponseEntity<AddressResponse> getDefault() {
        Long userId = SecurityUtils.getCurrentUserId();
        AddressResponse response = addressService.getDefaultAddress(userId);
        return ResponseEntity.ok(response);
    }

}
