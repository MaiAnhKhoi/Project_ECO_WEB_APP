package com.tlcn.fashion_api.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDto {
    
    private Long id;
    private String email;
    private String status;  // PENDING, ACCEPTED, EXPIRED, CANCELLED
    private Set<RoleDto> roles;
    private UserDto invitedBy;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;
    private LocalDateTime createdAt;
}

