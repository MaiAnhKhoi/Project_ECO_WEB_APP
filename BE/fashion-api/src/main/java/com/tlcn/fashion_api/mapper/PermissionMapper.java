package com.tlcn.fashion_api.mapper;

import com.tlcn.fashion_api.dto.user.PermissionDto;
import com.tlcn.fashion_api.entity.user.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {
    
    public PermissionDto toDto(Permission permission) {
        if (permission == null) {
            return null;
        }
        
        return PermissionDto.builder()
                .id(permission.getId())
                .code(permission.getCode())
                .description(permission.getDescription())
                .build();
    }
}

