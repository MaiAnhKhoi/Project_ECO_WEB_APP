package com.tlcn.fashion_api.service.banner;

import com.tlcn.fashion_api.dto.request.banner.CreateBannerRequest;
import com.tlcn.fashion_api.dto.request.banner.UpdateBannerRequest;
import com.tlcn.fashion_api.dto.response.banner.BannerAdminDto;
import com.tlcn.fashion_api.dto.response.banner.SliderItemDto;
import com.tlcn.fashion_api.entity.banner.Banner;
import com.tlcn.fashion_api.mapper.banner.BannerMapper;
import com.tlcn.fashion_api.repository.banner.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;

    /**
     * Lấy các banner ở vị trí "home" cho FE
     */
    public List<SliderItemDto> getHomeSliders() {
        List<Banner> banners =
                bannerRepository.findByPositionAndActiveOrderByIdAsc("home", true);

        return bannerMapper.toList(banners);
    }

    // ============ LIST (ADMIN) ============

    public Page<BannerAdminDto> listBanners(String position, Boolean active,
                                            String keyword, int page, int size) {

        var pageable = PageRequest.of(page, size);

        return bannerRepository
                .searchAdmin(position, active, keyword, pageable)
                .map(this::toDto);
    }

    // ============ DETAIL (ADMIN) ============

    public BannerAdminDto getBannerDetail(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Banner không tồn tại"));

        return toDto(banner);
    }

    // ============ CREATE (ADMIN) ============

    public BannerAdminDto createBanner(CreateBannerRequest req) {
        Banner banner = Banner.builder()
                .title(req.getTitle())
                .imageUrl(req.getImageUrl())
                .linkUrl(req.getLinkUrl())
                .position(req.getPosition())
                .active(req.getActive() != null ? req.getActive() : true)
                .build();

        Banner saved = bannerRepository.save(banner);
        return toDto(saved);
    }

    // ============ UPDATE (ADMIN) ============

    public BannerAdminDto updateBanner(Long id, UpdateBannerRequest req) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Banner không tồn tại"));

        if (req.getTitle() != null) banner.setTitle(req.getTitle());
        if (req.getImageUrl() != null) banner.setImageUrl(req.getImageUrl());
        if (req.getLinkUrl() != null) banner.setLinkUrl(req.getLinkUrl());
        if (req.getPosition() != null) banner.setPosition(req.getPosition());
        if (req.getActive() != null) banner.setActive(req.getActive());

        Banner saved = bannerRepository.save(banner);
        return toDto(saved);
    }

    // ============ DELETE (ADMIN) ============

    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Banner không tồn tại");
        }
        bannerRepository.deleteById(id);
    }

    // ============ TOGGLE ACTIVE (ADMIN) ============

    public BannerAdminDto updateActive(Long id, boolean active) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Banner không tồn tại"));

        banner.setActive(active);
        Banner saved = bannerRepository.save(banner);
        return toDto(saved);
    }

    // ============ MAPPER ============

    private BannerAdminDto toDto(Banner banner) {
        BannerAdminDto dto = new BannerAdminDto();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setImageUrl(banner.getImageUrl());
        dto.setLinkUrl(banner.getLinkUrl());
        dto.setPosition(banner.getPosition());
        dto.setActive(banner.getActive());
        dto.setCreatedAt(banner.getCreatedAt());
        return dto;
    }
}
