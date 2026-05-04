package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.ai.OutfitRequest;
import com.tlcn.fashion_api.dto.request.ai.ProductRecommendRequest;
import com.tlcn.fashion_api.dto.response.ai.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.entity.ai.AiRecommendationLog;
import com.tlcn.fashion_api.entity.ai.StyleAnalysisHistory;
import com.tlcn.fashion_api.entity.ai.UserBehaviorLog;
import com.tlcn.fashion_api.repository.ai.AiRecommendationLogRepository;
import com.tlcn.fashion_api.repository.ai.StyleAnalysisHistoryRepository;
import com.tlcn.fashion_api.security.JwtService;
import com.tlcn.fashion_api.service.ai.AiChatbotService;
import com.tlcn.fashion_api.service.ai.RecommendationService;
import com.tlcn.fashion_api.service.ai.StyleAnalysisService;
import com.tlcn.fashion_api.service.ai.UserBehaviorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiChatbotService chatbotService;
    private final RecommendationService recommendationService;
    private final StyleAnalysisService styleAnalysisService;
    private final UserBehaviorService behaviorService;
    private final JwtService jwtService;
    private final StyleAnalysisHistoryRepository styleAnalysisHistoryRepository;
    private final AiRecommendationLogRepository recommendationLogRepository;
    private final ObjectMapper objectMapper;

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
    // AI STYLE ANALYSIS
    // =========================================================================

    @PostMapping(value = "/style-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<StyleAnalysisResponse>> analyzeStyle(
            @RequestPart("image") MultipartFile image,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        // userId từ token ưu tiên hơn query param
        Long resolvedUserId = extractUserId(authHeader);
        if (resolvedUserId == null) resolvedUserId = userId;

        StyleAnalysisResponse response = styleAnalysisService.analyze(image, resolvedUserId);
        return ResponseEntity.ok(ApiResponse.success(response, "Phân tích phong cách thành công"));
    }

    // =========================================================================
    // AI HISTORY — unified history endpoints
    // =========================================================================

    @GetMapping("/history/style-analysis")
    public ResponseEntity<ApiResponse<Page<StyleAnalysisHistoryDto>>> getStyleHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = extractUserIdRequired(authHeader);
        Page<StyleAnalysisHistoryDto> history = styleAnalysisHistoryRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .map(h -> StyleAnalysisHistoryDto.from(h, objectMapper));
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/history/style-analysis/{id}")
    public ResponseEntity<ApiResponse<StyleAnalysisHistoryDto>> getStyleHistoryDetail(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = extractUserIdRequired(authHeader);
        StyleAnalysisHistory row = styleAnalysisHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch sử phân tích"));
        if (!row.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Không tìm thấy lịch sử phân tích");
        }
        StyleAnalysisHistoryDto dto = StyleAnalysisHistoryDto.from(row, objectMapper);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/history/outfits")
    public ResponseEntity<ApiResponse<Page<RecommendationHistoryDto>>> getOutfitHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = extractUserIdRequired(authHeader);
        Page<RecommendationHistoryDto> history = recommendationLogRepository
                .findByUserIdAndType(userId, AiRecommendationLog.RecommendationType.OUTFIT,
                        PageRequest.of(page, size))
                .map(RecommendationHistoryDto::from);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/history/outfits/{id}")
    public ResponseEntity<ApiResponse<OutfitResponse>> getOutfitHistoryDetail(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = extractUserIdRequired(authHeader);
        OutfitResponse response = recommendationService.getOutfitFromHistory(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history/recommendations")
    public ResponseEntity<ApiResponse<Page<RecommendationHistoryDto>>> getRecommendationHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = extractUserIdRequired(authHeader);
        Page<RecommendationHistoryDto> history = recommendationLogRepository
                .findByUserIdAndType(userId, AiRecommendationLog.RecommendationType.PERSONALIZED,
                        PageRequest.of(page, size))
                .map(RecommendationHistoryDto::from);
        return ResponseEntity.ok(ApiResponse.success(history));
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
