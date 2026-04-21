package com.tlcn.fashion_api.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_accounts", uniqueConstraints = {
    @UniqueConstraint(name = "uq_provider_user", columnNames = {"provider", "provider_user_id"})
}, indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 50)
    private String provider;  // google, facebook, apple, zalo
    
    @Column(name = "provider_user_id", nullable = false, length = 191)
    private String providerUserId;  // ID từ provider
    
    @Column(name = "provider_email", length = 191)
    private String providerEmail;
    
    @Column(name = "provider_name", length = 255)
    private String providerName;
    
    @Column(name = "provider_avatar", length = 512)
    private String providerAvatar;
    
    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;  // Token từ provider (nên encrypt)
    
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;
    
    @Column(name = "token_expires_at")
    private LocalDateTime tokenExpiresAt;
    
    @Column(name = "profile_data", columnDefinition = "LONGTEXT")
    private String profileData;  // JSON string
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
