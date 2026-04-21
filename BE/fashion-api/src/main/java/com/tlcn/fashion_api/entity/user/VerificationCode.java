package com.tlcn.fashion_api.entity.user;

import com.tlcn.fashion_api.common.enums.VerificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_codes", indexes = {
    @Index(name = "idx_vc_identifier", columnList = "identifier,type,expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, length = 191)
    private String identifier;  // Email hoặc phone
    
    @Column(nullable = false, length = 10)
    private String code;  // OTP code (6 digits thường)
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VerificationType type;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer attempts = 0;  // Số lần thử
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Helper methods
    public boolean isVerified() {
        return verifiedAt != null;
    }
    
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }
    
    public boolean isValid() {
        return !isVerified() && !isExpired();
    }
}
