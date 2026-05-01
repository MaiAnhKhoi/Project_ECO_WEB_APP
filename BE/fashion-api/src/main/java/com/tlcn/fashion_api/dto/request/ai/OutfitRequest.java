package com.tlcn.fashion_api.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OutfitRequest {

    @NotBlank(message = "Yêu cầu không được để trống")
    @Size(max = 500, message = "Yêu cầu không được vượt quá 500 ký tự")
    private String prompt;

    private String sessionId;
}
