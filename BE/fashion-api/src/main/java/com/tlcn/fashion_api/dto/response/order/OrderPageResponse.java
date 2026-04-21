package com.tlcn.fashion_api.dto.response.order;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderPageResponse {

    private List<OrderSummaryResponse> content;
    private int totalPages;
    private long totalElements;
    private int number; // current page
}
