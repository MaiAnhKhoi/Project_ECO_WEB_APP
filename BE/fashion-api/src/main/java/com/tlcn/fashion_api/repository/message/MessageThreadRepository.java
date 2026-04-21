package com.tlcn.fashion_api.repository.message;

import com.tlcn.fashion_api.entity.message.MessageThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MessageThreadRepository extends JpaRepository<MessageThread, Long> {

    // CUSTOMER_SUPPORT thread: subject dạng "SUPPORT:{customerId}"
    // Chỉ lấy những thread đã có ít nhất 1 message và sắp xếp theo thời gian tin nhắn mới nhất (gần nhất lên đầu)
    @Query("""
        select t
        from MessageThread t
        join Message m on m.thread = t
        where t.subject like 'SUPPORT:%'
        group by t
        order by max(m.createdAt) desc
        """)
    Page<MessageThread> findSupportThreads(Pageable pageable);

    // DIRECT: subject dạng "DIRECT:{userAId}:{userBId}"
    @Query("""
        select t
        from MessageThread t
        join Message m on m.thread = t
        where t.subject like concat('DIRECT:', :userId, ':%')
           or t.subject like concat('DIRECT:%:', :userId)
        group by t
        order by max(m.createdAt) desc
        """)
    Page<MessageThread> findDirectThreadsForUser(Long userId, Pageable pageable);

    Optional<MessageThread> findFirstBySubjectOrderByIdDesc(String subject);


    @Query("""
        select t
        from MessageThread t
        where t.subject = concat('SUPPORT:', :customerId)
        """)
    MessageThread findSupportThreadByCustomer(Long customerId);
}