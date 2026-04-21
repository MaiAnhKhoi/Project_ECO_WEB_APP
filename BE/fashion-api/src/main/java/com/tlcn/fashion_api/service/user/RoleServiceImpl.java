package com.tlcn.fashion_api.service.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.enums.UserStatus;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.dto.user.*;
import com.tlcn.fashion_api.entity.user.*;
import com.tlcn.fashion_api.mapper.InvitationMapper;
import com.tlcn.fashion_api.mapper.PermissionMapper;
import com.tlcn.fashion_api.mapper.RoleMapper;
import com.tlcn.fashion_api.repository.user.*;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RoleServiceImpl implements RoleService {
    
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;
    private final InvitationMapper invitationMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    
    @Value("${app.invitation.token-expiration}")
    private Long invitationTokenExpiration;
    
    @Override
    public RoleDto createRole(CreateRoleRequest request) {
        // Check if role code already exists
        if (roleRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Role code already exists: " + request.getCode());
        }
        
        Role role = Role.builder()
                .code(request.getCode())
                .name(request.getName())
                .build();
        
        role = roleRepository.save(role);
        
        // Assign permissions if provided
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
            role.getPermissions().addAll(permissions);
            role = roleRepository.save(role);
        }
        
        log.info("Role created: {}", role.getCode());
        return roleMapper.toDto(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public RoleDto getRoleById(Long id) {
        Role role = roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return roleMapper.toDto(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public RoleDto getRoleByCode(String code) {
        Role role = roleRepository.findByCodeWithPermissions(code)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + code));
        return roleMapper.toDto(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RoleDto> getAllRoles(Pageable pageable) {
        return roleRepository.findAll(pageable)
                .map(roleMapper::toDto);
    }
    
    @Override
    public RoleDto updateRole(Long id, UpdateRoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        if (request.getName() != null) {
            role.setName(request.getName());
        }
        
        if (request.getPermissionIds() != null) {
            role.getPermissions().clear();
            Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
            role.getPermissions().addAll(permissions);
        }
        
        role = roleRepository.save(role);
        log.info("Role updated: {}", role.getCode());
        
        return roleMapper.toDto(role);
    }
    
    @Override
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        // Check if role is in use
        List<UserRole> userRoles = userRoleRepository.findByRoleId(id);
        if (!userRoles.isEmpty()) {
            throw new BadRequestException("Cannot delete role that is assigned to users");
        }
        
        roleRepository.delete(role);
        log.info("Role deleted: {}", role.getCode());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PermissionDto> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public RoleDto assignPermissionsToRole(Long roleId, List<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Set<Permission> permissions = permissionRepository.findByIdIn(Set.copyOf(permissionIds));
        
        if (permissions.size() != permissionIds.size()) {
            throw new BadRequestException("Some permission IDs are invalid");
        }
        
        role.getPermissions().addAll(permissions);
        role = roleRepository.save(role);
        
        log.info("Permissions assigned to role: {}", role.getCode());
        return roleMapper.toDto(role);
    }
    
    @Override
    public RoleDto removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        role.getPermissions().remove(permission);
        role = roleRepository.save(role);
        
        log.info("Permission removed from role: {}", role.getCode());
        return roleMapper.toDto(role);
    }
    
    @Override
    public InvitationDto inviteUser(InviteUserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with this email already exists");
        }
        
        // Check if there's a pending invitation
        if (invitationRepository.existsByEmailAndStatus(request.getEmail(), "PENDING")) {
            throw new BadRequestException("A pending invitation already exists for this email");
        }
        
        // Validate role IDs
        Set<Role> roles = roleRepository.findByIdIn(request.getRoleIds());
        if (roles.size() != request.getRoleIds().size()) {
            throw new BadRequestException("Some role IDs are invalid");
        }
        
        // Get current user (inviter)
        Long inviterId = SecurityUtils.getCurrentUserId();
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("Inviter user not found"));
        
        // Create invitation
        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(invitationTokenExpiration));
        
        // Convert role IDs to JSON
        String roleIdsJson;
        try {
            roleIdsJson = objectMapper.writeValueAsString(request.getRoleIds());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize role IDs", e);
        }
        
        Invitation invitation = Invitation.builder()
                .email(request.getEmail())
                .token(token)
                .presetRoleIds(roleIdsJson)
                .invitedBy(inviter)
                .status("PENDING")
                .expiresAt(expiresAt)
                .build();
        
        invitation = invitationRepository.save(invitation);
        
        // Send invitation email
        Set<String> roleNames = roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        emailService.sendInvitationEmail(
                request.getEmail(),
                inviter.getName(),
                token,
                roleNames,
                request.getMessage()
        );
        
        log.info("Invitation sent to: {}", request.getEmail());
        return invitationMapper.toDto(invitation);
    }
    
    @Override
    public InvitationDto acceptInvitation(AcceptInvitationRequest request) {
        if (!StringUtils.hasText(request.getToken())) {
            throw new BadRequestException("Invitation token is required");
        }
        
        // Validate password confirmation
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new BadRequestException("Password confirmation does not match");
        }
        
        // Find and validate invitation
        Invitation invitation = invitationRepository.findValidInvitation(request.getToken(), LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired invitation token"));
        
        // Check if email already has a user
        if (userRepository.existsByEmail(invitation.getEmail())) {
            throw new BadRequestException("User with this email already exists");
        }
        
        // Parse role IDs from JSON
        List<Long> roleIds;
        try {
            roleIds = objectMapper.readValue(invitation.getPresetRoleIds(), new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse preset role IDs", e);
        }
        
        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(invitation.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status(UserStatus.ACTIVE) // Staff users are auto-activated
                .emailVerifiedAt(LocalDateTime.now()) // Auto-verify email for invited users
                .build();
        
        user = userRepository.save(user);
        
        // Assign roles
        Set<Role> roles = roleRepository.findByIdIn(Set.copyOf(roleIds));
        for (Role role : roles) {
            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(role)
                    .build();
            userRoleRepository.save(userRole);
        }
        
        // Mark invitation as accepted
        invitation.setStatus("ACCEPTED");
        invitation.setUsedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        
        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        
        log.info("Invitation accepted by: {}", user.getEmail());
        return invitationMapper.toDto(invitation);
    }
    
    @Override
    @Transactional(readOnly = true)
    public InvitationDto getInvitationById(Long id) {
        Invitation invitation = invitationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + id));
        return invitationMapper.toDto(invitation);
    }
    
    @Override
    @Transactional(readOnly = true)
    public InvitationDto getInvitationByToken(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with token: " + token));
        return invitationMapper.toDto(invitation);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<InvitationDto> getAllInvitations(Pageable pageable) {
        return invitationRepository.findAll(pageable)
                .map(invitationMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<InvitationDto> getInvitationsByStatus(String status, Pageable pageable) {
        return invitationRepository.findByStatus(status, pageable)
                .map(invitationMapper::toDto);
    }
    
    @Override
    public InvitationDto resendInvitation(Long invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + invitationId));
        
        if (!"PENDING".equals(invitation.getStatus())) {
            throw new BadRequestException("Can only resend pending invitations");
        }
        
        // Generate new token and extend expiration
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(LocalDateTime.now().plus(Duration.ofMillis(invitationTokenExpiration)));
        invitation = invitationRepository.save(invitation);
        
        // Parse role IDs and get role names
        List<Long> roleIds;
        try {
            roleIds = objectMapper.readValue(invitation.getPresetRoleIds(), new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse preset role IDs", e);
        }
        
        Set<Role> roles = roleRepository.findByIdIn(Set.copyOf(roleIds));
        Set<String> roleNames = roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        // Resend email
        emailService.sendInvitationEmail(
                invitation.getEmail(),
                invitation.getInvitedBy().getName(),
                invitation.getToken(),
                roleNames,
                null
        );
        
        log.info("Invitation resent to: {}", invitation.getEmail());
        return invitationMapper.toDto(invitation);
    }
    
    @Override
    public void cancelInvitation(Long invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + invitationId));
        
        if (!"PENDING".equals(invitation.getStatus())) {
            throw new BadRequestException("Can only cancel pending invitations");
        }
        
        invitation.setStatus("CANCELLED");
        invitationRepository.save(invitation);
        
        log.info("Invitation cancelled for: {}", invitation.getEmail());
    }
}
