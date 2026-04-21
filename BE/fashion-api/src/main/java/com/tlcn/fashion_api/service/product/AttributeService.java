package com.tlcn.fashion_api.service.product;

import com.tlcn.fashion_api.dto.response.product.AttributeDto;
import com.tlcn.fashion_api.dto.response.product.AttributeValueDto;
import com.tlcn.fashion_api.dto.response.product.CreateAttributeRequest;
import com.tlcn.fashion_api.dto.response.product.CreateAttributeValueRequest;
import com.tlcn.fashion_api.entity.product.Attribute;
import com.tlcn.fashion_api.entity.product.AttributeValue;
import com.tlcn.fashion_api.repository.product.AttributeRepository;
import com.tlcn.fashion_api.repository.product.AttributeValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttributeService {

    private final AttributeRepository attributeRepo;
    private final AttributeValueRepository valueRepo;

    // ================================
    // GET ALL
    // ================================
    public List<AttributeDto> getAllWithValues() {
        List<Attribute> attrs = attributeRepo.findAll(Sort.by("sortOrder").ascending());
        return attrs.stream().map(a -> {
            List<AttributeValue> values =
                    valueRepo.findByAttributeIdOrderByValueAsc(a.getId());
            List<AttributeValueDto> valueDtos = values.stream()
                    .map(v -> AttributeValueDto.builder()
                            .id(v.getId())
                            .value(v.getValue())
                            .code(v.getCode())
                            .colorCssClass(v.getColorCssClass())
                            .colorHex(v.getColorHex())
                            .build())
                    .toList();

            return AttributeDto.builder()
                    .id(a.getId())
                    .name(a.getName())
                    .code(a.getCode())
                    .sortOrder(a.getSortOrder())
                    .type(a.getType())
                    .values(valueDtos)
                    .build();
        }).toList();
    }

    // ================================
    // CREATE ATTRIBUTE
    // ================================
    public AttributeDto createAttribute(CreateAttributeRequest req) {
        Attribute a = new Attribute();
        a.setName(req.getName());
        a.setCode(req.getCode());
        a.setSortOrder(req.getSortOrder());
        a.setType(req.getType());
        a = attributeRepo.save(a);

        return AttributeDto.builder()
                .id(a.getId())
                .name(a.getName())
                .code(a.getCode())
                .sortOrder(a.getSortOrder())
                .type(a.getType())
                .values(Collections.emptyList())
                .build();
    }

    // ================================
    // UPDATE ATTRIBUTE
    // ================================
    public AttributeDto updateAttribute(Long id, CreateAttributeRequest req) {
        Attribute a = attributeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));

        a.setName(req.getName());
        a.setCode(req.getCode());
        a.setSortOrder(req.getSortOrder());
        a.setType(req.getType());
        a = attributeRepo.save(a);

        // load lại values để trả về đầy đủ
        List<AttributeValue> values =
                valueRepo.findByAttributeIdOrderByValueAsc(a.getId());
        List<AttributeValueDto> valueDtos = values.stream()
                .map(v -> AttributeValueDto.builder()
                        .id(v.getId())
                        .value(v.getValue())
                        .code(v.getCode())
                        .colorCssClass(v.getColorCssClass())
                        .colorHex(v.getColorHex())
                        .build())
                .toList();

        return AttributeDto.builder()
                .id(a.getId())
                .name(a.getName())
                .code(a.getCode())
                .sortOrder(a.getSortOrder())
                .type(a.getType())
                .values(valueDtos)
                .build();
    }

    // ================================
    // CREATE ATTRIBUTE VALUE
    // ================================
    public AttributeValueDto createAttributeValue(Long attributeId, CreateAttributeValueRequest req) {
        Attribute a = attributeRepo.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));

        AttributeValue v = new AttributeValue();
        v.setAttribute(a);
        v.setValue(req.getValue());
        v.setCode(req.getCode());
        v.setColorCssClass(req.getColorCssClass());
        v.setColorHex(req.getColorHex());
        v = valueRepo.save(v);

        return AttributeValueDto.builder()
                .id(v.getId())
                .value(v.getValue())
                .code(v.getCode())
                .colorCssClass(v.getColorCssClass())
                .colorHex(v.getColorHex())
                .build();
    }

    // ================================
    // UPDATE ATTRIBUTE VALUE
    // ================================
    public AttributeValueDto updateAttributeValue(Long valueId, CreateAttributeValueRequest req) {
        AttributeValue v = valueRepo.findById(valueId)
                .orElseThrow(() -> new RuntimeException("Attribute value not found"));

        // Nếu không cho đổi attribute thì giữ nguyên v.getAttribute()
        v.setValue(req.getValue());
        v.setCode(req.getCode());
        v.setColorCssClass(req.getColorCssClass());
        v.setColorHex(req.getColorHex());
        v = valueRepo.save(v);

        return AttributeValueDto.builder()
                .id(v.getId())
                .value(v.getValue())
                .code(v.getCode())
                .colorCssClass(v.getColorCssClass())
                .colorHex(v.getColorHex())
                .build();
    }

    // ================================
    // DELETE
    // ================================
    public void deleteAttribute(Long id) {
        attributeRepo.deleteById(id);
    }

    public void deleteAttributeValue(Long valueId) {
        valueRepo.deleteById(valueId);
    }

    public AttributeDto getById(Long id) {
        Attribute a = attributeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));
        return toDto(a);
    }
    private AttributeDto toDto(Attribute a) {
        List<AttributeValue> values =
                valueRepo.findByAttributeIdOrderByValueAsc(a.getId());

        List<AttributeValueDto> valueDtos = values.stream()
                .map(v -> AttributeValueDto.builder()
                        .id(v.getId())
                        .value(v.getValue())
                        .code(v.getCode())
                        .colorCssClass(v.getColorCssClass())
                        .colorHex(v.getColorHex())
                        .build())
                .toList();

        return AttributeDto.builder()
                .id(a.getId())
                .name(a.getName())
                .code(a.getCode())
                .sortOrder(a.getSortOrder())
                .type(a.getType())
                .values(valueDtos)
                .build();
    }
}
