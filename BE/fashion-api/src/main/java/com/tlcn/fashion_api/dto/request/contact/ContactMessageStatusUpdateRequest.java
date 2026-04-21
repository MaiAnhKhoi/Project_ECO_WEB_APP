package com.tlcn.fashion_api.dto.request.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactMessageStatusUpdateRequest {
    @NotBlank
    private String status;

    @Size(max = 1000)
    private String note;
}

