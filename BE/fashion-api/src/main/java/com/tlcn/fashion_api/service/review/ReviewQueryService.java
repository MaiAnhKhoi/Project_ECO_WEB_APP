package com.tlcn.fashion_api.service.review;

import com.tlcn.fashion_api.dto.review.TestimonialDto;
import com.tlcn.fashion_api.entity.review.Review;
import com.tlcn.fashion_api.mapper.review.ReviewMapper;
import com.tlcn.fashion_api.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewQueryService {

    private final ReviewRepository reviewRepository;

    public List<TestimonialDto> getFiveStarTestimonials() {
        List<Review> reviews = reviewRepository.findAllFiveStarApprovedWithRelations();
        List<TestimonialDto> result = new ArrayList<>();

        int index = 0;
        for (Review r : reviews) {
            String delay = index == 0 ? "" : "0." + index + "s";
            result.add(ReviewMapper.toTestimonial(r, delay));
            index++;
        }

        return result;
    }
}