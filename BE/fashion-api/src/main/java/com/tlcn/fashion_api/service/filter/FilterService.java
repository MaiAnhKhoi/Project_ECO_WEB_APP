package com.tlcn.fashion_api.service.filter;

import java.math.BigDecimal;
import java.util.List;

import com.tlcn.fashion_api.dto.response.filter.FilterResponse;
import com.tlcn.fashion_api.repository.filter.FilterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FilterService {

    private final FilterRepository filterRepository;

    public FilterResponse getGlobalFilters() {
        FilterResponse res = new FilterResponse();

        /* =================== PRICE =================== */
        List<Object[]> priceResult = filterRepository.findMinMaxPrice();
        Object[] priceRow = priceResult.isEmpty() ? null : priceResult.get(0);

        BigDecimal minPrice = BigDecimal.ZERO;
        BigDecimal maxPrice = BigDecimal.ZERO;

        if (priceRow != null) {
            if (priceRow[0] != null) minPrice = (BigDecimal) priceRow[0];
            if (priceRow[1] != null) maxPrice = (BigDecimal) priceRow[1];
        }

        FilterResponse.PriceFilter priceFilter = new FilterResponse.PriceFilter();
        priceFilter.setMin(minPrice);
        priceFilter.setMax(maxPrice);
        res.setPrice(priceFilter);


        /* =================== AVAILABILITY =================== */
        List<Object[]> availabilityResult = filterRepository.countAvailability();
        Object[] availabilityRow = availabilityResult.isEmpty() ? null : availabilityResult.get(0);

        FilterResponse.AvailabilityFilter availability = new FilterResponse.AvailabilityFilter();

        if (availabilityRow != null) {
            availability.setInStock(
                    availabilityRow[0] == null ? 0L : ((Number) availabilityRow[0]).longValue()
            );
            availability.setOutOfStock(
                    availabilityRow[1] == null ? 0L : ((Number) availabilityRow[1]).longValue()
            );
        } else {
            availability.setInStock(0L);
            availability.setOutOfStock(0L);
        }

        res.setAvailability(availability);


        /* =================== CATEGORIES =================== */
        res.setCategories(
                filterRepository.findCategoryFilters().stream().map(row -> {
                    FilterResponse.CategoryFilterItem dto = new FilterResponse.CategoryFilterItem();
                    dto.setId(((Number) row[0]).longValue());
                    dto.setName((String) row[1]);
                    dto.setSlug((String) row[2]);
                    dto.setCount(row[3] == null ? 0L : ((Number) row[3]).longValue());
                    return dto;
                }).toList()
        );


        /* =================== COLORS =================== */
        res.setColors(
                filterRepository.findColorFilters().stream().map(row -> {
                    FilterResponse.ColorFilterItem dto = new FilterResponse.ColorFilterItem();
                    dto.setId(((Number) row[0]).longValue());
                    dto.setName((String) row[1]);
                    dto.setCount(((Number) row[2]).longValue());
                    return dto;
                }).toList()
        );


        /* =================== SIZES =================== */
        res.setSizes(
                filterRepository.findAllSizeFilters().stream().map(row -> {
                    FilterResponse.SizeFilterItem dto = new FilterResponse.SizeFilterItem();
                    dto.setAttributeId(((Number) row[0]).longValue());  // 2 = clothing, 3 = shoes
                    dto.setSize((String) row[1]);                       // "M", "L", "36", "37"
                    dto.setCount(((Number) row[2]).longValue());
                    return dto;
                }).toList()
        );


        /* =================== BRANDS =================== */
        res.setBrands(
                filterRepository.findBrandFilters().stream().map(row -> {
                    FilterResponse.BrandFilterItem dto = new FilterResponse.BrandFilterItem();
                    dto.setId(((Number) row[0]).longValue());
                    dto.setName((String) row[1]);
                    dto.setCount(((Number) row[2]).longValue());
                    return dto;
                }).toList()
        );

        return res;
    }
}
