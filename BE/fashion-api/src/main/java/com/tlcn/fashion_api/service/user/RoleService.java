package com.tlcn.fashion_api.service.user;

import com.tlcn.fashion_api.dto.user.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoleService {
    
    // Role CRUD
    RoleDto createRole(CreateRoleRequest request);
    RoleDto getRoleById(Long id);
    RoleDto getRoleByCode(String code);
    List<RoleDto> getAllRoles();
    Page<RoleDto> getAllRoles(Pageable pageable);
    RoleDto updateRole(Long id, UpdateRoleRequest request);
    void deleteRole(Long id);
    
    // Permission management
    List<PermissionDto> getAllPermissions();
    RoleDto assignPermissionsToRole(Long roleId, List<Long> permissionIds);
    RoleDto removePermissionFromRole(Long roleId, Long permissionId);
    
    // Invitation management (Staff/Employee invite)
    InvitationDto inviteUser(InviteUserRequest request);
    InvitationDto acceptInvitation(AcceptInvitationRequest request);
    InvitationDto getInvitationById(Long id);
    InvitationDto getInvitationByToken(String token);
    Page<InvitationDto> getAllInvitations(Pageable pageable);
    Page<InvitationDto> getInvitationsByStatus(String status, Pageable pageable);
    InvitationDto resendInvitation(Long invitationId);
    void cancelInvitation(Long invitationId);
}
