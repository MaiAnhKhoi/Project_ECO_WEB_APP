package com.tlcn.fashion_api.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "Email or username is required")
    @JsonAlias({"email", "username"})
    private String identifier;  // Email hoặc username
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private Boolean rememberMe;  // Giữ đăng nhập lâu hơn
}
