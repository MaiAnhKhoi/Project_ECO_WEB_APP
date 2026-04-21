package com.tlcn.fashion_api.repository.message;

import com.tlcn.fashion_api.entity.message.Message;
import com.tlcn.fashion_api.entity.message.MessageThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByThreadOrderByCreatedAtAsc(MessageThread thread, Pageable pageable);

    Message findTop1ByThreadOrderByCreatedAtDesc(MessageThread thread);

    @Query("""
        select count(m)
        from Message m
        where m.thread.id = :threadId
          and m.senderId <> :userId
          and not exists (
              select 1 from MessageRead r
              where r.messageId = m.id
                and r.userId = :userId
          )
        """)
    long countUnreadByThreadAndUser(Long threadId, Long userId);
}