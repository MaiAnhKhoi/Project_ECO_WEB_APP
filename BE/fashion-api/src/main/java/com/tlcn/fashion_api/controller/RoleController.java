package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.user.*;
import com.tlcn.fashion_api.service.user.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Role & Permission Management", description = "Role, Permission and Invitation APIs")
public class RoleController {
    
    private final RoleService roleService;
    
    // ========== Role Management ==========
    
    @GetMapping
    @PreAuthorize("hasAuthority('role:read') or hasRole('ADMIN')")
    @Operation(summary = "Get all roles")
    public ResponseEntity<ApiResponse<PageResponse<RoleDto>>> getAllRoles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoleDto> roles = roleService.getAllRoles(pageable);
        PageResponse<RoleDto> response = PageResponse.of(roles);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('role:read') or hasRole('ADMIN')")
    @Operation(summary = "Get all roles (no pagination)")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRolesNoPagination() {
        List<RoleDto> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('role:read') or hasRole('ADMIN')")
    @Operation(summary = "Get role by ID")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleById(@PathVariable Long id) {
        RoleDto role = roleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(role));
    }
    
    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('role:read') or hasRole('ADMIN')")
    @Operation(summary = "Get role by code")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleByCode(@PathVariable String code) {
        RoleDto role = roleService.getRoleByCode(code);
        return ResponseEntity.ok(ApiResponse.success(role));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('role:create') or hasRole('ADMIN')")
    @Operation(summary = "Create new role (Admin only)")
    public ResponseEntity<ApiResponse<RoleDto>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        RoleDto role = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(role, "Role created successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('role:update') or hasRole('ADMIN')")
    @Operation(summary = "Update role (Admin only)")
    public ResponseEntity<ApiResponse<RoleDto>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        RoleDto role = roleService.updateRole(id, request);
        return ResponseEntity.ok(ApiResponse.success(role, "Role updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('role:delete') or hasRole('ADMIN')")
    @Operation(summary = "Delete role (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role deleted successfully"));
    }
    
    // ========== Permission Management ==========
    
    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('permission:read') or hasRole('ADMIN')")
    @Operation(summary = "Get all permissions")
    public ResponseEntity<ApiResponse<List<PermissionDto>>> getAllPermissions() {
        List<PermissionDto> permissions = roleService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }
    
    @PostMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('role:update') or hasRole('ADMIN')")
    @Operation(summary = "Assign permissions to role")
    public ResponseEntity<ApiResponse<RoleDto>> assignPermissionsToRole(
            @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds
    ) {
        RoleDto role = roleService.assignPermissionsToRole(roleId, permissionIds);
        return ResponseEntity.ok(ApiResponse.success(role, "Permissions assigned successfully"));
    }
    
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('role:update') or hasRole('ADMIN')")
    @Operation(summary = "Remove permission from role")
    public ResponseEntity<ApiResponse<RoleDto>> removePermissionFromRole(
            @PathVariable Long roleId,
            @PathVariable Long permissionId
    ) {
        RoleDto role = roleService.removePermissionFromRole(roleId, permissionId);
        return ResponseEntity.ok(ApiResponse.success(role, "Permission removed successfully"));
    }
    
    // ========== Invitation Management (Staff/Employee) ==========
    
    @PostMapping("/invite")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Invite staff/employee (Admin only)")
    public ResponseEntity<ApiResponse<InvitationDto>> inviteUser(@Valid @RequestBody InviteUserRequest request) {
        InvitationDto invitation = roleService.inviteUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(invitation, "Invitation sent successfully"));
    }
    
    @PostMapping("/invitations/{token}/accept")
    @Operation(summary = "Accept invitation (set password and create account)")
    public ResponseEntity<ApiResponse<InvitationDto>> acceptInvitation(
            @PathVariable String token,
            @Valid @RequestBody AcceptInvitationRequest request
    ) {
        request.setToken(token);
        InvitationDto invitation = roleService.acceptInvitation(request);
        return ResponseEntity.ok(ApiResponse.success(invitation, "Invitation accepted successfully. You can now login."));
    }
    
    @GetMapping("/invitations")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Get all invitations (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<InvitationDto>>> getAllInvitations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InvitationDto> invitations = roleService.getAllInvitations(pageable);
        PageResponse<InvitationDto> response = PageResponse.of(invitations);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/invitations/status/{status}")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Get invitations by status (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<InvitationDto>>> getInvitationsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InvitationDto> invitations = roleService.getInvitationsByStatus(status, pageable);
        PageResponse<InvitationDto> response = PageResponse.of(invitations);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/invitations/{id}")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Get invitation by ID")
    public ResponseEntity<ApiResponse<InvitationDto>> getInvitationById(@PathVariable Long id) {
        InvitationDto invitation = roleService.getInvitationById(id);
        return ResponseEntity.ok(ApiResponse.success(invitation));
    }
    
    @PostMapping("/invitations/{id}/resend")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Resend invitation email (Admin only)")
    public ResponseEntity<ApiResponse<InvitationDto>> resendInvitation(@PathVariable Long id) {
        InvitationDto invitation = roleService.resendInvitation(id);
        return ResponseEntity.ok(ApiResponse.success(invitation, "Invitation resent successfully"));
    }
    
    @PostMapping("/invitations/{id}/cancel")
    @PreAuthorize("hasAuthority('user:invite') or hasRole('ADMIN')")
    @Operation(summary = "Cancel invitation (Admin only)")
    public ResponseEntity<ApiResponse<Void>> cancelInvitation(@PathVariable Long id) {
        roleService.cancelInvitation(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Invitation cancelled successfully"));
    }
}
