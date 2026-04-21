package com.tlcn.fashion_api.repository.review;

import com.tlcn.fashion_api.entity.review.ReviewMedia;
import com.tlcn.fashion_api.entity.review.ReviewMediaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewMediaRepository extends JpaRepository<ReviewMedia, ReviewMediaId> {
}