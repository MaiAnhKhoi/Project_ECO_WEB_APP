package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.dto.request.ai.OutfitRequest;
import com.tlcn.fashion_api.dto.request.ai.ProductRecommendRequest;
import com.tlcn.fashion_api.dto.response.ai.OutfitResponse;
import com.tlcn.fashion_api.dto.response.ai.RecommendationResponse;

public interface RecommendationService {

    /**
     * Tạo 3 outfit gợi ý từ prompt người dùng.
     * Kết quả được cache theo hash của prompt (TTL 1h).
     */
    OutfitResponse generateOutfit(OutfitRequest request, Long userId);

    /**
     * Gợi ý sản phẩm theo prompt hoặc lịch sử xem của user.
     */
    RecommendationResponse recommendProducts(ProductRecommendRequest request, Long userId);

    /**
     * Trả về danh sách sản phẩm trending.
     * Cached 10 phút.
     */
    RecommendationResponse getTrending(int limit);
}
