package com.tlcn.fashion_api.repository.message;

import com.tlcn.fashion_api.entity.message.MessageRead;
import com.tlcn.fashion_api.entity.message.MessageReadId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface MessageReadRepository extends JpaRepository<MessageRead, MessageReadId> {
    List<MessageRead> findByUserIdAndMessageIdIn(Long userId, Collection<Long> messageIds);

}
