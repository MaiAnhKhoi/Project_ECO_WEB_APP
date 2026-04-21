package com.tlcn.fashion_api.entity.review;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewMediaId implements Serializable {

    private Long reviewId;
    private Long mediaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReviewMediaId)) return false;
        ReviewMediaId that = (ReviewMediaId) o;
        return Objects.equals(reviewId, that.reviewId) &&
                Objects.equals(mediaId, that.mediaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reviewId, mediaId);
    }
}
