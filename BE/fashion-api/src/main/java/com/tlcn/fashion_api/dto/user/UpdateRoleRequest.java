package com.tlcn.fashion_api.dto.user;

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
public class UpdateRoleRequest {
    
    @Size(max = 128, message = "Role name must not exceed 128 characters")
    private String name;
    
    private Set<Long> permissionIds;
}

