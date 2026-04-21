package com.tlcn.fashion_api.service.product;

import com.tlcn.fashion_api.dto.request.brand.CreateBrandRequest;
import com.tlcn.fashion_api.dto.request.brand.UpdateBrandRequest;
import com.tlcn.fashion_api.dto.response.brand.BrandDto;
import com.tlcn.fashion_api.mapper.brand.BrandMapper;
import com.tlcn.fashion_api.repository.brand.BrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // Hàm lấy danh sách Brand
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(BrandMapper::toDto)
                .collect(Collectors.toList());
    }


    public Page<BrandDto> getAllBrandsAdmin(Pageable pageable) {
        return brandRepository.findAll(pageable)
                .map(BrandMapper::toDto);
    }

    public BrandDto getBrandById(Long id) {
        var brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return BrandMapper.toDto(brand);
    }

    public BrandDto createBrand(CreateBrandRequest req) {
        var brand = BrandMapper.toEntity(req);   // ✅ ĐÚNG
        brandRepository.save(brand);
        return BrandMapper.toDto(brand);         // ✅ entity -> dto
    }

    public BrandDto updateBrand(Long id, UpdateBrandRequest req) {
        var brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        BrandMapper.updateEntity(brand, req);
        brandRepository.save(brand);
        return BrandMapper.toDto(brand);
    }

    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}
