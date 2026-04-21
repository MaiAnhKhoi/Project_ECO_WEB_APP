package com.tlcn.fashion_api.mapper.brand;

import com.tlcn.fashion_api.dto.request.brand.CreateBrandRequest;
import com.tlcn.fashion_api.dto.request.brand.UpdateBrandRequest;
import com.tlcn.fashion_api.dto.response.brand.BrandDto;
import com.tlcn.fashion_api.entity.product.Brand;

public final class BrandMapper {

    private BrandMapper() {
        // utility class
    }

    // entity -> DTO
    public static BrandDto toDto(Brand brand) {
        if (brand == null) return null;

        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setSlug(brand.getSlug());
        dto.setImageUrl(brand.getImageUrl());
        return dto;
    }

    // CreateBrandRequest -> entity (khi tạo mới)
    public static Brand toEntity(CreateBrandRequest req) {
        if (req == null) return null;

        Brand brand = new Brand();
        brand.setName(req.getName());
        brand.setSlug(req.getSlug());
        brand.setImageUrl(req.getImageUrl());
        return brand;
    }

    // UpdateBrandRequest -> cập nhật entity (khi sửa)
    public static void updateEntity(Brand brand, UpdateBrandRequest req) {
        if (brand == null || req == null) return;

        brand.setName(req.getName());
        brand.setSlug(req.getSlug());

        // chỉ set nếu có gửi imageUrl
        if (req.getImageUrl() != null) {
            brand.setImageUrl(req.getImageUrl());
        }
    }
}
