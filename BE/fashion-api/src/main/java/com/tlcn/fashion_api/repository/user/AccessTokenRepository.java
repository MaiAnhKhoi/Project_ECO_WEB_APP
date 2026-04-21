package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.entity.user.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {
    
    Optional<AccessToken> findByTokenHash(String tokenHash);
    
    List<AccessToken> findByUserId(Long userId);
    
    @Query("SELECT at FROM AccessToken at WHERE at.user.id = :userId AND at.revokedAt IS NULL AND at.expiresAt > :now")
    List<AccessToken> findActiveTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE AccessToken at SET at.revokedAt = :now WHERE at.user.id = :userId AND at.revokedAt IS NULL")
    void revokeAllUserTokens(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM AccessToken at WHERE at.expiresAt < :cutoffDate OR at.revokedAt < :cutoffDate")
    void deleteExpiredAndRevoked(@Param("cutoffDate") LocalDateTime cutoffDate);
}
