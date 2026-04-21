package com.tlcn.fashion_api.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.dto.user.InvitationDto;
import com.tlcn.fashion_api.entity.user.Invitation;
import com.tlcn.fashion_api.entity.user.Role;
import com.tlcn.fashion_api.repository.user.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvitationMapper {
    
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final RoleRepository roleRepository;
    private final ObjectMapper objectMapper;
    
    public InvitationDto toDto(Invitation invitation) {
        if (invitation == null) {
            return null;
        }
        
        // Parse preset role IDs from JSON and fetch roles
        Set<Long> roleIds = parseRoleIds(invitation.getPresetRoleIds());
        Set<Role> roles = roleIds.isEmpty() ? Collections.emptySet() : roleRepository.findByIdIn(roleIds);
        
        return InvitationDto.builder()
                .id(invitation.getId())
                .email(invitation.getEmail())
                .status(invitation.getStatus())
                .roles(roles.stream().map(roleMapper::toDto).collect(Collectors.toSet()))
                .invitedBy(invitation.getInvitedBy() != null ? userMapper.toDto(invitation.getInvitedBy()) : null)
                .expiresAt(invitation.getExpiresAt())
                .usedAt(invitation.getUsedAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }
    
    private Set<Long> parseRoleIds(String presetRoleIdsJson) {
        try {
            return objectMapper.readValue(presetRoleIdsJson, new TypeReference<Set<Long>>() {});
        } catch (Exception e) {
            log.error("Failed to parse preset role IDs: {}", presetRoleIdsJson, e);
            return Collections.emptySet();
        }
    }
}

