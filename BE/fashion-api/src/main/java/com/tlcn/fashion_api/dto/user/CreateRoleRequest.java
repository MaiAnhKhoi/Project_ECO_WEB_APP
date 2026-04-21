package com.tlcn.fashion_api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleRequest {
    
    @NotBlank(message = "Role code is required")
    @Size(max = 64, message = "Role code must not exceed 64 characters")
    private String code;
    
    @NotBlank(message = "Role name is required")
    @Size(max = 128, message = "Role name must not exceed 128 characters")
    private String name;
    
    private Set<Long> permissionIds;
}

