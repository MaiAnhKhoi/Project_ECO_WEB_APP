package com.tlcn.fashion_api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    private String name;
    
    @Email(message = "Email should be valid")
    private String email;
    
    @Size(min = 3, max = 80, message = "Username must be between 3 and 80 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;
    
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number should be valid")
    private String phone;
    
    @Pattern(regexp = "^(male|female|other)$", message = "Gender must be male, female, or other")
    private String gender;
    
    private LocalDate dateOfBirth;
    
    private String avatarUrl;
}
