package com.tlcn.fashion_api.service.user;

import com.tlcn.fashion_api.common.enums.UserStatus;
import com.tlcn.fashion_api.common.enums.VerificationType;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.dto.auth.ChangePasswordRequest;
import com.tlcn.fashion_api.dto.user.*;
import com.tlcn.fashion_api.entity.user.Role;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.entity.user.UserRole;
import com.tlcn.fashion_api.entity.user.VerificationCode;
import com.tlcn.fashion_api.mapper.UserMapper;
import com.tlcn.fashion_api.repository.user.*;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;

    private static final List<String> STAFF_ROLE_CODES = List.of(
            "ADMIN",
            "PRODUCT_MANAGER",
            "ORDER_MANAGER",
            "CUSTOMER_SERVICE",
            "MARKETING_STAFF",
            "ACCOUNTANT"
    );

    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        if (request.getUsername() != null &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);

        user = userRepository.save(user);

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            assignRolesToUser(user, request.getRoleIds());
        }

        return userMapper.toDto(user);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return userMapper.toDto(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return userMapper.toDto(user);
    }

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    public Page<UserDto> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchUsers(keyword, pageable).map(userMapper::toDto);
    }

    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (request.getName() != null) user.setName(request.getName());
        
        // Handle email change - require re-verification
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            
            // Update email and reset verification status
            user.setEmail(request.getEmail());
            user.setEmailVerifiedAt(null);
            user.setStatus(UserStatus.PENDING);
            
            // Generate and send verification code
            String code = generateVerificationCode();
            saveVerificationCode(user.getEmail(), code);
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), code);
            
            log.info("Email changed for user: {}. Verification required.", user.getEmail());
        }

        if (request.getUsername() != null) {
            if (!request.getUsername().equals(user.getUsername()) &&
                    userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        accessTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());
        refreshTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());

        userRepository.delete(user);
    }

    public UserDto updateUserStatus(Long id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setStatus(request.getStatus());
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public UserDto activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setStatus(UserStatus.ACTIVE);
        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public UserDto suspendUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setStatus(UserStatus.SUSPENDED);

        accessTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());
        refreshTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public UserDto lockUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setStatus(UserStatus.LOCKED);
        user.setLockedUntil(LocalDateTime.now().plusDays(30));

        accessTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());
        refreshTokenRepository.revokeAllUserTokens(id, LocalDateTime.now());

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public void unlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);

        if (user.getStatus() == UserStatus.LOCKED) {
            user.setStatus(UserStatus.ACTIVE);
        }

        userRepository.save(user);
    }

    public UserProfileDto getCurrentUserProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        return userMapper.toProfileDto(user);
    }

    public UserProfileDto updateCurrentUserProfile(UpdateUserRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (request.getName() != null) user.setName(request.getName());
        
        // Handle email change - require re-verification
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            
            // Update email and reset verification status
            user.setEmail(request.getEmail());
            user.setEmailVerifiedAt(null);
            user.setStatus(UserStatus.PENDING);
            
            // Revoke all tokens to force re-login after email verification
            accessTokenRepository.revokeAllUserTokens(currentUserId, LocalDateTime.now());
            refreshTokenRepository.revokeAllUserTokens(currentUserId, LocalDateTime.now());
            
            // Generate and send verification code
            String code = generateVerificationCode();
            saveVerificationCode(user.getEmail(), code);
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), code);
            
            log.info("Email changed for user: {}. Verification required.", user.getEmail());
        }
        
        if (request.getUsername() != null) {
            if (!request.getUsername().equals(user.getUsername()) &&
                    userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);
        return userMapper.toProfileDto(user);
    }

    public UserDto assignRoles(Long userId, AssignRolesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Prevent admin from removing their own ADMIN role
        Role adminRole = roleRepository.findByCode("ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("ADMIN role not found"));

        boolean targetHasAdminRole = userRoleRepository.existsByUserIdAndRoleId(userId, adminRole.getId());

        if (targetHasAdminRole) {
            boolean newRolesIncludeAdmin = request.getRoleIds() != null &&
                    request.getRoleIds().contains(adminRole.getId());

            if (!newRolesIncludeAdmin) {
                throw new BadRequestException("ADMIN role cannot be removed from a user");
            }
        }

        userRoleRepository.deleteByUserId(userId);
        assignRolesToUser(user, request.getRoleIds());

        return userMapper.toDto(userRepository.findByIdWithRoles(userId).orElseThrow());
    }

    public UserDto removeRole(Long userId, Long roleId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Role adminRole = roleRepository.findByCode("ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("ADMIN role not found"));

        if (roleId.equals(adminRole.getId())) {
            throw new BadRequestException("ADMIN role cannot be removed from a user");
        }

        userRoleRepository.deleteByUserIdAndRoleId(userId, roleId);

        return userMapper.toDto(userRepository.findByIdWithRoles(userId).orElseThrow());
    }

    public Page<UserDto> getUsersByRole(String roleCode, Pageable pageable) {
        return userRepository.findByRoleCode(roleCode, pageable)
                .map(userMapper::toDto);
    }

    public Page<UserDto> getStaffUsers(Pageable pageable) {
        return userRepository.findStaffUsersByRoleCodes(STAFF_ROLE_CODES, pageable)
                .map(userMapper::toDto);
    }

    public void changePassword(ChangePasswordRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new BadRequestException("Password confirmation does not match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void adminResetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Page<LoginHistoryDto> getUserLoginHistory(Long userId, Pageable pageable) {
        return loginHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(userMapper::toLoginHistoryDto);
    }

    public Page<LoginHistoryDto> getCurrentUserLoginHistory(Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return getUserLoginHistory(currentUserId, pageable);
    }


    private void assignRolesToUser(User user, Set<Long> roleIds) {
        Set<Role> roles = roleRepository.findByIdIn(roleIds);

        if (roles.size() != roleIds.size()) {
            throw new BadRequestException("Some role IDs are invalid");
        }

        for (Role role : roles) {
            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(role)
                    .build();
            userRoleRepository.save(userRole);
        }
    }
    
    // Helper methods for email verification
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }
    
    private void saveVerificationCode(String email, String code) {
        VerificationCode verificationCode = VerificationCode.builder()
                .identifier(email)
                .code(code)
                .type(VerificationType.EMAIL_VERIFICATION)
                .expiresAt(LocalDateTime.now().plus(Duration.ofMinutes(15))) // 15 minutes expiration
                .build();
        verificationCodeRepository.save(verificationCode);
    }
}
