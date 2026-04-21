package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.common.enums.VerificationType;
import com.tlcn.fashion_api.entity.user.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.identifier = :identifier AND vc.type = :type AND vc.verifiedAt IS NULL AND vc.expiresAt > :now ORDER BY vc.createdAt DESC")
    Optional<VerificationCode> findLatestUnverifiedCode(
        @Param("identifier") String identifier,
        @Param("type") VerificationType type,
        @Param("now") LocalDateTime now
    );
    
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.identifier = :identifier AND vc.code = :code AND vc.type = :type AND vc.verifiedAt IS NULL AND vc.expiresAt > :now")
    Optional<VerificationCode> findByIdentifierAndCodeAndType(
        @Param("identifier") String identifier,
        @Param("code") String code,
        @Param("type") VerificationType type,
        @Param("now") LocalDateTime now
    );
    
    @Modifying
    @Query("DELETE FROM VerificationCode vc WHERE vc.expiresAt < :cutoffDate OR vc.verifiedAt < :cutoffDate")
    void deleteExpiredAndVerified(@Param("cutoffDate") LocalDateTime cutoffDate);
}

