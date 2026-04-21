package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatistics {
    private Long total;
    private Long active;
    private Long inactive;
    private Long todayRegistered;
    private Long thisWeekRegistered;
    private Long thisMonthRegistered;
}

