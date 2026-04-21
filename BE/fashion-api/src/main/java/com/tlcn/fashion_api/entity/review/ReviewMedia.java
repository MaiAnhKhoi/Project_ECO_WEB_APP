package com.tlcn.fashion_api.entity.review;

import com.tlcn.fashion_api.entity.media.Media;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "review_media")
@Getter
@Setter
public class ReviewMedia {

    @EmbeddedId
    private ReviewMediaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reviewId")
    @JoinColumn(name = "review_id")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("mediaId")
    @JoinColumn(name = "media_id")
    private Media media;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
