package com.tlcn.fashion_api.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailedStatistics {
    private List<TimeSeriesData> last7Days; // Daily data for last 7 days
    private List<TimeSeriesData> last30Days; // Daily data for last 30 days
    private List<TimeSeriesData> last12Months; // Monthly data for last 12 months
    private List<TimeSeriesData> last52Weeks; // Weekly data for last 52 weeks
}

