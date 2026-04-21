package com.tlcn.fashion_api.service.auth;

import com.tlcn.fashion_api.common.enums.LoginMethod;
import com.tlcn.fashion_api.common.enums.LoginStatus;
import com.tlcn.fashion_api.common.enums.UserStatus;
import com.tlcn.fashion_api.common.enums.VerificationType;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.common.exception.UnauthorizedException;
import com.tlcn.fashion_api.dto.auth.*;
import com.tlcn.fashion_api.dto.user.UserDto;
import com.tlcn.fashion_api.entity.user.*;
import com.tlcn.fashion_api.mapper.UserMapper;
import com.tlcn.fashion_api.repository.user.*;
import com.tlcn.fashion_api.security.JwtService;
import com.tlcn.fashion_api.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final String SUPPORT_CONTACT_EMAIL = "huynngoc77@gmail.com";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserMapper userMapper;

    @Value("${app.verification.code-length}")
    private Integer verificationCodeLength;

    @Value("${app.verification.code-expiration}")
    private Long verificationCodeExpiration;

    @Value("${app.password-reset.token-expiration}")
    private Long passwordResetExpiration;

    @Value("${app.security.max-failed-login-attempts}")
    private Integer maxFailedLoginAttempts;

    @Value("${app.security.account-lock-duration}")
    private Long accountLockDuration;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    @Override
    public UserDto register(RegisterRequest request) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new BadRequestException("Xác nhận mật khẩu không khớp");
        }

        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }

        // Create user with PENDING status
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(UserStatus.PENDING) // Customer needs email verification
                .build();

        user = userRepository.save(user);

        // Assign default USER role
        Role userRole = roleRepository.findByCode("USER")
                .orElseThrow(() -> new RuntimeException("Default USER role not found"));

        UserRole ur = UserRole.builder()
                .user(user)
                .role(userRole)
                .build();
        userRoleRepository.save(ur);

        // Generate and send verification code
        String code = generateVerificationCode();
        saveVerificationCode(user.getEmail(), code, VerificationType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), code);

        log.info("User registered: {}", user.getEmail());
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(noRollbackFor = UnauthorizedException.class)
    public LoginResponse login(LoginRequest request) {
        // Find user by email or username - always get fresh data from database
        User user = userRepository.findByEmailOrUsername(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new UnauthorizedException("Thông tin đăng nhập không hợp lệ"));

        // Auto-unlock account if lock duration has expired
        if (user.getStatus() == UserStatus.LOCKED && user.getLockedUntil() != null) {
            if (user.getLockedUntil().isBefore(LocalDateTime.now())) {
                // Lock duration expired, unlock the account
                user.setStatus(UserStatus.ACTIVE);
                user.setLockedUntil(null);
                user.setFailedLoginAttempts(0);
                userRepository.save(user);
                log.info("Account auto-unlocked after lock duration expired: {}", user.getEmail());
            }
        }

        // Check if account is currently locked (must check after auto-unlock)
        if (user.isLocked()) {
            long minutesRemaining = Duration.between(LocalDateTime.now(), user.getLockedUntil()).toMinutes();
            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Account is locked");
            throw new UnauthorizedException("Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau "
                    + minutesRemaining + " phút hoặc liên hệ quản trị viên qua " + SUPPORT_CONTACT_EMAIL + ".");
        }


        // Check if account status is LOCKED but lock duration expired (edge case)
        if (user.getStatus() == UserStatus.LOCKED && (user.getLockedUntil() == null || user.getLockedUntil().isBefore(LocalDateTime.now()))) {
            // Lock duration expired but status wasn't updated, unlock the account
            user.setStatus(UserStatus.ACTIVE);
            user.setLockedUntil(null);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            log.info("Account unlocked (status was LOCKED but lock duration expired): {}", user.getEmail());
        }

        // Check if email is verified (for all users except invited staff)
        // Invited staff users are auto-verified when they accept invitation
        if (!user.isEmailVerified()) {
            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Email not verified");
            throw new UnauthorizedException("Vui lòng xác thực email trước khi đăng nhập");
        }
        
        // Also check if status is PENDING - they should verify email first
        if (user.getStatus() == UserStatus.PENDING) {
            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Account pending verification");
            throw new UnauthorizedException("Vui lòng xác thực email trước khi đăng nhập");
        }

        // Check user status
        if (user.getStatus() == UserStatus.SUSPENDED) {
            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Account suspended");
            throw new UnauthorizedException("Tài khoản đã bị tạm khóa");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Account inactive");
            throw new UnauthorizedException("Tài khoản không hoạt động");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Get current failed attempts before incrementing
            int currentAttempts = user.getFailedLoginAttempts();

            // Increment failed login attempts
            user.setFailedLoginAttempts(currentAttempts + 1);
            log.info("Failed login attempt for user: {}. Attempts: {} -> {}",
                    user.getEmail(), currentAttempts, user.getFailedLoginAttempts());

            // Lock account if too many failed attempts
            if (user.getFailedLoginAttempts() >= maxFailedLoginAttempts) {
                user.setStatus(UserStatus.LOCKED);
                user.setLockedUntil(LocalDateTime.now().plus(Duration.ofMillis(accountLockDuration)));
                long lockMinutes = Duration.ofMillis(accountLockDuration).toMinutes();
                log.warn("Account locked due to too many failed login attempts: {}. Failed attempts: {}. Locked for {} minutes",
                        user.getEmail(), user.getFailedLoginAttempts(), lockMinutes);
            }

            // Save user with updated failed attempts and flush to ensure it's persisted
            user = userRepository.save(user);
            userRepository.flush(); // Force flush to database immediately

            // Reload user from database to ensure we have the latest failedLoginAttempts
            user = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found after save"));

            log.info("Saved and reloaded user with failed login attempts: {} for user: {}",
                    user.getFailedLoginAttempts(), user.getEmail());

            recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.FAILED, "Invalid password");

            // Provide more informative error message
            int remainingAttempts = maxFailedLoginAttempts - user.getFailedLoginAttempts();
            log.info("Remaining attempts: " + user.getFailedLoginAttempts());

            if (remainingAttempts > 0) {
                throw new UnauthorizedException("Mật khẩu không đúng. Còn " + remainingAttempts + " lần thử.");
            } else {
                long lockMinutes = Duration.ofMillis(accountLockDuration).toMinutes();
                throw new UnauthorizedException("Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau "
                        + lockMinutes + " phút hoặc liên hệ quản trị viên qua " + SUPPORT_CONTACT_EMAIL + ".");
            }
        }

        // Reset failed login attempts on successful login
        user.setFailedLoginAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        Set<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        // Save tokens
        saveAccessToken(user, accessToken);
        saveRefreshToken(user, refreshToken);

        // Record successful login
        recordLoginHistory(user, LoginMethod.EMAIL, LoginStatus.SUCCESS, null);

        log.info("User logged in: {}", user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000) // Convert to seconds
                .user(userMapper.toDto(user))
                .build();
    }

    @Override
    public void logout(String token) {
        try {
            String tokenHash = hashToken(token);
            AccessToken accessToken = accessTokenRepository.findByTokenHash(tokenHash)
                    .orElse(null);

            if (accessToken != null) {
                accessToken.setRevokedAt(LocalDateTime.now());
                accessTokenRepository.save(accessToken);
                log.info("User logged out: {}", accessToken.getUser().getEmail());
            }
        } catch (Exception e) {
            log.error("Error during logout", e);
        }
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtService.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Token làm mới không hợp lệ");
        }

        String tokenHash = hashToken(request.getRefreshToken());
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy token làm mới"));

        if (!refreshToken.isValid()) {
            throw new UnauthorizedException("Token làm mới không hợp lệ hoặc đã hết hạn");
        }

        // Get user
        User user = refreshToken.getUser();

        // Generate new access token
        Set<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), roles);
        saveAccessToken(user, newAccessToken);

        log.info("Token refreshed for user: {}", user.getEmail());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .build();
    }

    @Override
    public void verifyEmail(VerifyEmailRequest request) {
        VerificationCode verificationCode = verificationCodeRepository
                .findByIdentifierAndCodeAndType(
                        request.getEmail(),
                        request.getCode(),
                        VerificationType.EMAIL_VERIFICATION,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification code"));

        // Mark code as verified
        verificationCode.setVerifiedAt(LocalDateTime.now());
        verificationCodeRepository.save(verificationCode);

        // Update user status
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerifiedAt(LocalDateTime.now());
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        log.info("Email verified for user: {}", user.getEmail());
    }

    @Override
    public void resendVerificationCode(ResendVerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email đã được xác thực");
        }

        // Generate and send new code
        String code = generateVerificationCode();
        saveVerificationCode(user.getEmail(), code, VerificationType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), code);

        log.info("Verification code resent to: {}", user.getEmail());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate reset code
        String code = generateVerificationCode();
        saveVerificationCode(user.getEmail(), code, VerificationType.PASSWORD_RESET);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), code);

        log.info("Password reset code sent to: {}", user.getEmail());
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        // Validate password confirmation
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new BadRequestException("Xác nhận mật khẩu không khớp");
        }

        // Validate reset code
        VerificationCode verificationCode = verificationCodeRepository
                .findByIdentifierAndCodeAndType(
                        request.getEmail(),
                        request.getCode(),
                        VerificationType.PASSWORD_RESET,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset code"));

        // Update password
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark code as verified
        verificationCode.setVerifiedAt(LocalDateTime.now());
        verificationCodeRepository.save(verificationCode);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu hiện tại không đúng");
        }

        // Validate password confirmation
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new BadRequestException("Xác nhận mật khẩu không khớp");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getEmail());
    }

    @Override
    public String generateAccessToken(Long userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        return jwtService.generateAccessToken(userId, user.getEmail(), roles);
    }

    @Override
    public String generateRefreshToken(Long userId) {
        return jwtService.generateRefreshToken(userId);
    }

    @Override
    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

    @Override
    public Long getUserIdFromToken(String token) {
        return jwtService.getUserIdFromToken(token);
    }

    @Override
    public void revokeAllUserTokens(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        accessTokenRepository.revokeAllUserTokens(userId, now);
        refreshTokenRepository.revokeAllUserTokens(userId, now);
        log.info("All tokens revoked for user ID: {}", userId);
    }

    // Helper methods

    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < verificationCodeLength; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    private void saveVerificationCode(String identifier, String code, VerificationType type) {
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(
                type == VerificationType.PASSWORD_RESET ? passwordResetExpiration : verificationCodeExpiration
        ));

        VerificationCode verificationCode = VerificationCode.builder()
                .identifier(identifier)
                .code(code)
                .type(type)
                .expiresAt(expiresAt)
                .build();

        verificationCodeRepository.save(verificationCode);
    }

    private void saveAccessToken(User user, String token) {
        String tokenHash = hashToken(token);
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(accessTokenExpiration));

        AccessToken accessToken = AccessToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();

        accessTokenRepository.save(accessToken);
    }

    private void saveRefreshToken(User user, String token) {
        String tokenHash = hashToken(token);
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(refreshTokenExpiration));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing token", e);
        }
    }

    private void recordLoginHistory(User user, LoginMethod method, LoginStatus status, String failureReason) {
        LoginHistory loginHistory = LoginHistory.builder()
                .user(user)
                .loginMethod(method)
                .status(status)
                .failureReason(failureReason)
                .build();

        loginHistoryRepository.save(loginHistory);
    }
}