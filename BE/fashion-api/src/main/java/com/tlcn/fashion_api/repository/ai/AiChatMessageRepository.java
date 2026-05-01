package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.AiChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {

    List<AiChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    @Query("""
            SELECT m FROM AiChatMessage m
            WHERE m.conversation.id = :conversationId
            ORDER BY m.createdAt DESC
            """)
    List<AiChatMessage> findRecentMessages(@Param("conversationId") Long conversationId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(m.tokensUsed), 0) FROM AiChatMessage m WHERE m.conversation.id = :conversationId")
    Integer sumTokensByConversationId(@Param("conversationId") Long conversationId);
}
