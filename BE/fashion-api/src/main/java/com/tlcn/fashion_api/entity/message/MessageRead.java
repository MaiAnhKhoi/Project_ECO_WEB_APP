package com.tlcn.fashion_api.entity.message;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_reads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(MessageReadId.class)
public class MessageRead {

    @Id
    @Column(name = "message_id")
    private Long messageId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "read_at", nullable = false,
            columnDefinition = "datetime default current_timestamp()")
    private LocalDateTime readAt;
}
