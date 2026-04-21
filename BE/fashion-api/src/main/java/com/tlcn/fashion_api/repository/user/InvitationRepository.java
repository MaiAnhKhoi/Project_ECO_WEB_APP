package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.entity.user.Invitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    
    Optional<Invitation> findByToken(String token);
    
    Optional<Invitation> findByEmailAndStatus(String email, String status);
    
    @Query("SELECT i FROM Invitation i WHERE i.token = :token AND i.status = 'PENDING' AND i.expiresAt > :now AND i.usedAt IS NULL")
    Optional<Invitation> findValidInvitation(@Param("token") String token, @Param("now") LocalDateTime now);
    
    Page<Invitation> findByStatus(String status, Pageable pageable);
    
    Page<Invitation> findByInvitedById(Long invitedById, Pageable pageable);
    
    boolean existsByEmailAndStatus(String email, String status);
}

