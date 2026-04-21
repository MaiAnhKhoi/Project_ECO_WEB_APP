package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatistics {
    private Long total;
    private Long today;
    private Long thisWeek;
    private Long thisMonth;
    private Long pending;
    private Long confirmed;
    private Long cancelled;
    private Long completed;
}

