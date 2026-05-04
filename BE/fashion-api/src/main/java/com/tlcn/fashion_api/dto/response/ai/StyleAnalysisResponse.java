package com.tlcn.fashion_api.dto.response.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StyleAnalysisResponse {

    /** MALE | FEMALE | UNISEX | UNKNOWN */
    private String gender;

    private String bodyType;
    private String skinTone;
    private String recommendedStyle;
    private Double confidenceScore;
    private String analyzedImageUrl;

    /**
     * true khi AI không chắc chắn về giới tính (confidence thấp).
     * FE hiển thị dialog cho user chọn lại: Nam / Nữ / Unisex.
     */
    private boolean needsGenderConfirmation;

    /** Gợi ý sản phẩm phù hợp với phong cách phân tích được. */
    private List<ProductSuggestionDto> products;

    private boolean fromCache;
    private Long profileId;
}
