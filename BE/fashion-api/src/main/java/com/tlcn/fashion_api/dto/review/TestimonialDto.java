package com.tlcn.fashion_api.dto.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialDto {
    private String name;
    private String review;
    private String product;
    private String image;
    private String delay;
}