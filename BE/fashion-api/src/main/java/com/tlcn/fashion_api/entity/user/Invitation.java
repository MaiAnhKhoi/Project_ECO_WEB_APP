package com.tlcn.fashion_api.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invitations", indexes = {
    @Index(name = "idx_token", columnList = "token"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_expires_at", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 191)
    private String email;
    
    @Column(nullable = false, unique = true, length = 255)
    private String token;
    
    @Column(name = "preset_role_ids", columnDefinition = "JSON", nullable = false)
    private String presetRoleIds;  // JSON array: [1, 2, 3]
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by", nullable = false)
    private User invitedBy;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";  // PENDING, ACCEPTED, EXPIRED, CANCELLED
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Helper methods
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }
    
    public boolean isUsed() {
        return usedAt != null;
    }
    
    public boolean isValid() {
        return "PENDING".equals(status) && !isExpired() && !isUsed();
    }
}

