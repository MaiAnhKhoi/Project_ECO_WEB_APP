package com.tlcn.fashion_api.dto.request.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactMessageRequest {
    @NotBlank
    @Size(max = 150)
    private String name;

    @Email
    @NotBlank
    @Size(max = 200)
    private String email;

    @NotBlank
    @Size(max = 2000)
    private String message;
}

