package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewItemDto {
    private Long id;
    private String name;
    private String date;   // format sẵn string cho UI
    private String avatar; // url
    private int rating;
    private String comment;
}
