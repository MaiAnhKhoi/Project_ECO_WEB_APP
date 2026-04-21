package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesData {
    private String date; // Format: "YYYY-MM-DD" or "Week X" or "Month X"
    private Long orders;
    private BigDecimal revenue;
    private Long users;
}

