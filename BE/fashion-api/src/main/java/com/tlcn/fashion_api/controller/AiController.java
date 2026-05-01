package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.ai.OutfitRequest;
import com.tlcn.fashion_api.dto.request.ai.ProductRecommendRequest;
import com.tlcn.fashion_api.dto.response.ai.*;
import com.tlcn.fashion_api.entity.ai.UserBehaviorLog;
import com.tlcn.fashion_api.security.JwtService;
import com.tlcn.fashion_api.service.ai.AiChatbotService;
import com.tlcn.fashion_api.service.ai.RecommendationService;
import com.tlcn.fashion_api.service.ai.UserBehaviorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiChatbotService chatbotService;
    private final RecommendationService recommendationService;
    private final UserBehaviorService behaviorService;
    private final JwtService jwtService;

    // =========================================================================
    // CHATBOT — POST /api/ai/chat được đăng ký trong AiChatServletRouter (RouterFunctionMapping ưu tiên cao)
    // =========================================================================

    @GetMapping("/chat/history")
    public ResponseEntity<ApiResponse<Page<ConversationHistoryDto>>> getChatHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = extractUserIdRequired(authHeader);
        Page<ConversationHistoryDto> history = chatbotService.getChatHistory(
                userId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/chat/conversation/{id}")
    public ResponseEntity<ApiResponse<ConversationHistoryDto>> getConversation(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        ConversationHistoryDto dto = chatbotService.getConversation(id, userId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // =========================================================================
    // OUTFIT GENERATOR
    // =========================================================================

    @PostMapping("/recommend/outfit")
    public ResponseEntity<ApiResponse<OutfitResponse>> generateOutfit(
            @Valid @RequestBody OutfitRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        OutfitResponse response = recommendationService.generateOutfit(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Outfit được tạo thành công"));
    }

    // =========================================================================
    // PRODUCT RECOMMENDATION
    // =========================================================================

    @PostMapping("/recommend/products")
    public ResponseEntity<ApiResponse<RecommendationResponse>> recommendProducts(
            @RequestBody ProductRecommendRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        RecommendationResponse response = recommendationService.recommendProducts(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recommend/trending")
    public ResponseEntity<ApiResponse<RecommendationResponse>> getTrending(
            @RequestParam(defaultValue = "10") int limit
    ) {
        RecommendationResponse response = recommendationService.getTrending(Math.min(limit, 20));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // =========================================================================
    // BEHAVIOR TRACKING
    // =========================================================================

    @PostMapping("/behavior/track")
    public ResponseEntity<ApiResponse<Void>> trackBehavior(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam String behaviorType,
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        UserBehaviorLog.BehaviorType type;
        try {
            type = UserBehaviorLog.BehaviorType.valueOf(behaviorType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid behavior type"));
        }

        behaviorService.logBehavior(userId, sessionId, productId, categoryId, brandId, type);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged"));
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            String token = authHeader.substring(7);
            return jwtService.getUserIdFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }

    private Long extractUserIdRequired(String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) throw new com.tlcn.fashion_api.common.exception.UnauthorizedException("Vui lòng đăng nhập");
        return userId;
    }
}
