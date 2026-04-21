package com.tlcn.fashion_api.service.contact;

import com.tlcn.fashion_api.dto.response.contact.ContactInfoResponse;
import com.tlcn.fashion_api.entity.shopsetting.ShopSettings;
import com.tlcn.fashion_api.repository.shopsetting.ShopSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ShopSettingsRepository shopSettingsRepository;

    @Transactional(readOnly = true)
    public ContactInfoResponse getContactInfo() {
        // Vì bảng này chỉ có 1 record id = 1
        ShopSettings settings = shopSettingsRepository.findById((byte) 1)
                .orElseThrow(() -> new IllegalStateException("Shop settings not found"));

        ContactInfoResponse dto = new ContactInfoResponse();
        dto.setShopName(settings.getShopName());
        dto.setLogoUrl(settings.getLogoUrl());
        dto.setAddress(settings.getContactAddress());
        dto.setPhone(settings.getContactPhone());
        dto.setEmail(settings.getContactEmail());
        dto.setOpeningHours(settings.getContactOpeningHours());
        dto.setMapIframe(settings.getContactMapIframe());
        dto.setFacebookUrl(settings.getSocialFacebookUrl());
        dto.setInstagramUrl(settings.getSocialInstagramUrl());
        dto.setXUrl(settings.getSocialXUrl());
        dto.setSnapchatUrl(settings.getSocialSnapchatUrl());
        return dto;
    }
}