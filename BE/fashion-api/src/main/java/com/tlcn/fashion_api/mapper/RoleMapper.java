package com.tlcn.fashion_api.mapper;

import com.tlcn.fashion_api.dto.user.RoleDto;
import com.tlcn.fashion_api.entity.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoleMapper {
    
    private final PermissionMapper permissionMapper;
    
    public RoleDto toDto(Role role) {
        if (role == null) {
            return null;
        }
        
        return RoleDto.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .permissions(role.getPermissions().stream()
                        .map(permissionMapper::toDto)
                        .collect(Collectors.toSet()))
                .build();
    }
    
    public RoleDto toDtoWithoutPermissions(Role role) {
        if (role == null) {
            return null;
        }
        
        return RoleDto.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .build();
    }
}

