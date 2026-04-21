package com.tlcn.fashion_api.entity.message;

import com.tlcn.fashion_api.entity.media.Media;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "message_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageMedia {

    @EmbeddedId
    private MessageMediaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("messageId")
    @JoinColumn(name = "message_id")
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("mediaId")
    @JoinColumn(name = "media_id")
    private Media media;

    @Column(name = "sort_order")
    private Integer sortOrder;
}