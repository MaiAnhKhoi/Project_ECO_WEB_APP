package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.AiChatConversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AiChatConversationRepository extends JpaRepository<AiChatConversation, Long> {

    Optional<AiChatConversation> findBySessionIdAndStatus(
            String sessionId, AiChatConversation.ConversationStatus status);

    Page<AiChatConversation> findByUserIdAndStatusOrderByUpdatedAtDesc(
            Long userId, AiChatConversation.ConversationStatus status, Pageable pageable);

    @Query("""
            SELECT c FROM AiChatConversation c
            WHERE c.userId = :userId
            AND c.status = 'ACTIVE'
            ORDER BY c.updatedAt DESC
            """)
    List<AiChatConversation> findActiveConversationsByUser(@Param("userId") Long userId, Pageable pageable);
}
