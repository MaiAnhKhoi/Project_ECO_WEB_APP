package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.user.*;
import com.tlcn.fashion_api.service.user.UserService;
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
import org.springframework.web.multipart.MultipartFile;
import com.tlcn.fashion_api.cloudinary.CloudinaryService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User management APIs")
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:read') or hasRole('ADMIN')")
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> users;

        if ("staff".equalsIgnoreCase(type)) {
            users = userService.getStaffUsers(pageable);
        } else if ("customer".equalsIgnoreCase(type)) {
            users = userService.getUsersByRole("USER", pageable);
        } else {
            users = userService.getAllUsers(pageable);
        }

        PageResponse<UserDto> response = PageResponse.of(users);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('user:read') or hasRole('ADMIN')")
    @Operation(summary = "Search users by keyword")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> users = userService.searchUsers(keyword, pageable);
        PageResponse<UserDto> response = PageResponse.of(users);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:read') or hasRole('ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('user:create') or hasRole('ADMIN')")
    @Operation(summary = "Create new user (Admin only)")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(user, "User created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Update user")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        UserDto user = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(user, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete') or hasRole('ADMIN')")
    @Operation(summary = "Delete user (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Update user status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        UserDto user = userService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(user, "User status updated successfully"));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Activate user")
    public ResponseEntity<ApiResponse<UserDto>> activateUser(@PathVariable Long id) {
        UserDto user = userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success(user, "User activated successfully"));
    }

    @PostMapping("/{id}/suspend")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Suspend user")
    public ResponseEntity<ApiResponse<UserDto>> suspendUser(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        UserDto user = userService.suspendUser(id, reason);
        return ResponseEntity.ok(ApiResponse.success(user, "User suspended successfully"));
    }

    @PostMapping("/{id}/lock")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Lock user")
    public ResponseEntity<ApiResponse<UserDto>> lockUser(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        UserDto user = userService.lockUser(id, reason);
        return ResponseEntity.ok(ApiResponse.success(user, "User locked successfully"));
    }

    @PostMapping("/{id}/unlock")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Unlock user")
    public ResponseEntity<ApiResponse<Void>> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User unlocked successfully"));
    }

    @PostMapping("/{id}/assign-roles")
    @PreAuthorize("hasAuthority('role:assign') or hasRole('ADMIN')")
    @Operation(summary = "Assign roles to user")
    public ResponseEntity<ApiResponse<UserDto>> assignRoles(
            @PathVariable Long id,
            @Valid @RequestBody AssignRolesRequest request
    ) {
        request.setUserId(id);
        UserDto user = userService.assignRoles(id, request);
        return ResponseEntity.ok(ApiResponse.success(user, "Roles assigned successfully"));
    }

    @DeleteMapping("/{id}/roles/{roleId}")
    @PreAuthorize("hasAuthority('role:assign') or hasRole('ADMIN')")
    @Operation(summary = "Remove role from user")
    public ResponseEntity<ApiResponse<UserDto>> removeRole(
            @PathVariable Long id,
            @PathVariable Long roleId
    ) {
        UserDto user = userService.removeRole(id, roleId);
        return ResponseEntity.ok(ApiResponse.success(user, "Role removed successfully"));
    }

    @GetMapping("/{id}/login-history")
    @PreAuthorize("hasAuthority('user:read') or hasRole('ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Get user login history")
    public ResponseEntity<ApiResponse<PageResponse<LoginHistoryDto>>> getUserLoginHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LoginHistoryDto> history = userService.getUserLoginHistory(id, pageable);
        PageResponse<LoginHistoryDto> response = PageResponse.of(history);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('user:update') or hasRole('ADMIN')")
    @Operation(summary = "Admin reset user password")
    public ResponseEntity<ApiResponse<Void>> adminResetPassword(
            @PathVariable Long id,
            @RequestParam String newPassword
    ) {
        userService.adminResetPassword(id, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
    }

    @GetMapping("/by-role/{roleCode}")
    @PreAuthorize("hasAuthority('user:read') or hasRole('ADMIN')")
    @Operation(summary = "Get users by role")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getUsersByRole(
            @PathVariable String roleCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> users = userService.getUsersByRole(roleCode, pageable);
        PageResponse<UserDto> response = PageResponse.of(users);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUserProfile() {
        UserProfileDto profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateCurrentUserProfile(
            @Valid @RequestBody UpdateUserRequest request
    ) {
        UserProfileDto profile = userService.updateCurrentUserProfile(request);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile updated successfully"));
    }

    @PostMapping("/me/avatar")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload avatar for current user")
    public ResponseEntity<ApiResponse<UserProfileDto>> uploadAvatar(
            @RequestParam("file") MultipartFile file
    ) {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image");
        }

        // Validate file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File size must be less than 5MB");
        }

        // Validate image format
        String[] allowedTypes = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"};
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (contentType.equals(type)) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            throw new BadRequestException("Image format not supported. Allowed: JPEG, PNG, GIF, WEBP");
        }

        // Upload to Cloudinary
        String avatarUrl = cloudinaryService.uploadFile(file, "avatars");

        if (avatarUrl == null || avatarUrl.isEmpty()) {
            throw new BadRequestException("Failed to upload avatar to Cloudinary");
        }

        // Update user profile with new avatar URL
        UpdateUserRequest updateRequest = new UpdateUserRequest();
        updateRequest.setAvatarUrl(avatarUrl);

        UserProfileDto profile = userService.updateCurrentUserProfile(updateRequest);
        return ResponseEntity.ok(ApiResponse.success(profile, "Avatar uploaded successfully"));
    }
}