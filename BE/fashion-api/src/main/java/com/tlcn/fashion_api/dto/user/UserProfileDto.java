package com.tlcn.fashion_api.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    
    private Long id;
    private String name;
    private String username;
    private String email;
    private Boolean emailVerified;
    private String phone;
    private Boolean phoneVerified;
    private String gender;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private Boolean twoFactorEnabled;
    private LocalDateTime lastLoginAt;
}
