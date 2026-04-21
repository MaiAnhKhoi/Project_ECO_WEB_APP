package com.tlcn.fashion_api.entity.message;

import com.tlcn.fashion_api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private MessageThread thread;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", insertable = false, updatable = false)
    private User sender;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "content_text", columnDefinition = "text")
    private String contentText;

    @Column(name = "status", nullable = false)
    private String status; // visible / hidden

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "datetime default current_timestamp()")
    private LocalDateTime createdAt;
}