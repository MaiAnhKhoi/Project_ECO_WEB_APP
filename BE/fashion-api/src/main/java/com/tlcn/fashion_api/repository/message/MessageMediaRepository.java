package com.tlcn.fashion_api.repository.message;

import com.tlcn.fashion_api.entity.message.MessageMedia;
import com.tlcn.fashion_api.entity.message.MessageMediaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface MessageMediaRepository extends JpaRepository<MessageMedia, MessageMediaId> {

    @Query("""
        select mm
        from MessageMedia mm
        join fetch mm.media m
        where mm.message.id in :messageIds
        order by mm.message.id asc, mm.sortOrder asc
        """)
    List<MessageMedia> findAllByMessageIdInWithMedia(Collection<Long> messageIds);
}
