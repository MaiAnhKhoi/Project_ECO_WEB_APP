package com.tlcn.fashion_api.service.auth;

import com.tlcn.fashion_api.dto.auth.*;
import com.tlcn.fashion_api.dto.user.UserDto;

public interface AuthService {
    
    // Registration & Login
    UserDto register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void logout(String token);
    TokenResponse refreshToken(RefreshTokenRequest request);
    
    // Email verification
    void verifyEmail(VerifyEmailRequest request);
    void resendVerificationCode(ResendVerificationRequest request);
    
    // Password management
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
    
    // JWT utilities
    String generateAccessToken(Long userId);
    String generateRefreshToken(Long userId);
    boolean validateToken(String token);
    Long getUserIdFromToken(String token);
    void revokeAllUserTokens(Long userId);
}
