package com.tlcn.fashion_api.service.vton;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.entity.vton.VirtualTryOnHistory;
import com.tlcn.fashion_api.repository.vton.VirtualTryOnHistoryRepository;
import com.tlcn.fashion_api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VirtualTryOnService {

    private final WebClient replicateWebClient;
    private final VirtualTryOnHistoryRepository historyRepository;
    private final CloudinaryService cloudinaryService;

    @Value("${replicate.idm-version}")
    private String idmVersion;

    @Value("${replicate.vton-path:/predictions}") // baseUrl = https://api.replicate.com/v1
    private String vtonPath;

    private Map<String, Object> buildInput(String category,
                                           String modelImageUrl,
                                           String garmentImageUrl) {
        Map<String, Object> input = new HashMap<>();
        input.put("human_img", modelImageUrl);
        input.put("garm_img", garmentImageUrl);
        input.put("category", category);
        input.put("garment_des", "fashion item");
        input.put("steps", 30);
        return input;
    }

    private String callReplicate(Map<String, Object> input) {
        Map<String, Object> body = new HashMap<>();
        body.put("version", idmVersion);
        body.put("input", input);

        ReplicatePredictionResponse prediction = replicateWebClient.post()
                .uri(vtonPath)
                .header("Prefer", "wait=60")
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp ->
                        resp.bodyToMono(String.class)
                                .flatMap(b -> Mono.error(new RuntimeException("Replicate error: " + b)))
                )
                .bodyToMono(ReplicatePredictionResponse.class)
                .block();

        if (prediction == null) {
            throw new RuntimeException("No response from Replicate");
        }

        if (prediction.getOutput() != null && !prediction.getOutput().isEmpty()) {
            return prediction.getOutput();
        }

        String id = prediction.getId();
        long start = System.currentTimeMillis();
        long timeoutMs = 90_000;

        while (System.currentTimeMillis() - start < timeoutMs) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            prediction = replicateWebClient.get()
                    .uri(vtonPath + "/" + id)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, resp ->
                            resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new RuntimeException("Replicate error: " + b)))
                    )
                    .bodyToMono(ReplicatePredictionResponse.class)
                    .block();

            if (prediction == null) {
                continue;
            }

            String status = prediction.getStatus();
            if ("succeeded".equalsIgnoreCase(status)
                    || "failed".equalsIgnoreCase(status)
                    || "canceled".equalsIgnoreCase(status)) {
                break;
            }
        }

        if (prediction == null
                || prediction.getOutput() == null
                || prediction.getOutput().isEmpty()) {
            throw new RuntimeException("Replicate chưa trả ảnh");
        }

        return prediction.getOutput();
    }

    public VirtualTryOnHistory tryOn(Long productId,
                                     Long variantId,
                                     String category,
                                     String modelImageUrl,
                                     String garmentImageUrl) {

        // Phòng trường hợp có bug từ chỗ khác lọt qua
        if (modelImageUrl == null || modelImageUrl.isBlank()) {
            throw new IllegalArgumentException("modelImageUrl is required");
        }
        if (garmentImageUrl == null || garmentImageUrl.isBlank()) {
            throw new IllegalArgumentException("garmentImageUrl is required");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("category is required");
        }

        Long userId = SecurityUtils.getCurrentUserId();

        Map<String, Object> input = buildInput(category, modelImageUrl, garmentImageUrl);
        String resultImageUrl = callReplicate(input);

        // Upload kết quả ảnh thử đồ (đang nằm trên server của Replicate và có thể bị xóa sau vài giờ)
        // sang Cloudinary để lưu trữ lâu dài.
        String cloudResultImageUrl = cloudinaryService.uploadFromUrl(
                resultImageUrl,
                "virtual-tryon-results"
        );

        // Nếu upload Cloudinary thất bại vì lý do nào đó, vẫn fallback dùng URL gốc để tránh lỗi 500
        if (cloudResultImageUrl == null || cloudResultImageUrl.isBlank()) {
            cloudResultImageUrl = resultImageUrl;
        }

        VirtualTryOnHistory history = VirtualTryOnHistory.builder()
                .userId(userId)
                .productId(productId)
                .variantId(variantId)
                .category(category)
                .modelImageUrl(modelImageUrl)
                .garmentImageUrl(garmentImageUrl)
                .resultImageUrl(cloudResultImageUrl)
                .createdAt(LocalDateTime.now())
                .build();

        return historyRepository.save(history);
    }
}
