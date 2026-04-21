package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.response.filter.FilterResponse;
import com.tlcn.fashion_api.service.filter.FilterService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FilterController {

    private final FilterService filterService;

    public FilterController(FilterService filterService) {
        this.filterService = filterService;
    }

    @GetMapping("/api/filters")
    public FilterResponse getFilters() {
        return filterService.getGlobalFilters();
    }
}