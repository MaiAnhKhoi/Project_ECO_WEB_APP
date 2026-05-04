package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.dto.response.ai.StyleAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface StyleAnalysisService {

    /**
     * Phân tích ảnh người dùng và trả về kết quả body type, skin tone, recommended style
     * cùng danh sách sản phẩm gợi ý phù hợp từ hệ thống.
     *
     * @param image  ảnh upload từ client (JPEG/PNG, ≤ 5MB)
     * @param userId ID người dùng (nullable — guest cho phép phân tích nhưng không lưu profile)
     */
    StyleAnalysisResponse analyze(MultipartFile image, Long userId);
}
