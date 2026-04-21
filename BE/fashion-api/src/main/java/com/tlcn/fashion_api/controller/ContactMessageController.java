package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.contact.ContactMessageRequest;
import com.tlcn.fashion_api.service.contact.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitContactMessage(
            @Valid @RequestBody ContactMessageRequest request
    ) {
        contactMessageService.submit(request);
        return ResponseEntity.ok(ApiResponse.success("Cảm ơn bạn đã liên hệ!"));
    }
}

