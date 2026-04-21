package com.tlcn.fashion_api.mapper;

import com.tlcn.fashion_api.dto.user.CreateUserRequest;
import com.tlcn.fashion_api.dto.user.LoginHistoryDto;
import com.tlcn.fashion_api.dto.user.UserDto;
import com.tlcn.fashion_api.dto.user.UserProfileDto;
import com.tlcn.fashion_api.entity.user.LoginHistory;
import com.tlcn.fashion_api.entity.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapper {
    
    private final RoleMapper roleMapper;
    
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .phone(user.getPhone())
                .phoneVerified(user.isPhoneVerified())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(user.getUserRoles().stream()
                        .map(ur -> roleMapper.toDto(ur.getRole()))
                        .collect(Collectors.toSet()))
                .build();
    }
    
    public UserProfileDto toProfileDto(User user) {
        if (user == null) {
            return null;
        }
        
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .phone(user.getPhone())
                .phoneVerified(user.isPhoneVerified())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
    
    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }
        
        return User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .build();
    }
    
    public LoginHistoryDto toLoginHistoryDto(LoginHistory loginHistory) {
        if (loginHistory == null) {
            return null;
        }
        
        return LoginHistoryDto.builder()
                .id(loginHistory.getId())
                .loginMethod(loginHistory.getLoginMethod())
                .ipAddress(loginHistory.getIpAddress())
                .userAgent(loginHistory.getUserAgent())
                .location(loginHistory.getLocation())
                .status(loginHistory.getStatus())
                .failureReason(loginHistory.getFailureReason())
                .createdAt(loginHistory.getCreatedAt())
                .build();
    }
}
