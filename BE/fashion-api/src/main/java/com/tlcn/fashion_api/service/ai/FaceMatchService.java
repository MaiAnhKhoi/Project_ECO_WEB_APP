package com.tlcn.fashion_api.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * Service để kiểm tra giới tính trong ảnh sử dụng Replicate API
 * Model: apna-mart/face-match
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FaceMatchService {

    private final WebClient replicateWebClient;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${replicate.face-match-version:}")
    private String faceMatchVersion;

    /**
     * Kiểm tra giới tính trong ảnh
     * @param imageFile File ảnh cần kiểm tra
     * @return "male" hoặc "female" hoặc null nếu không detect được
     */
    public String detectGender(MultipartFile imageFile) {
        try {
            // Upload ảnh lên Cloudinary để lấy URL (Replicate cần URL, không phải base64)
            String imageUrl = cloudinaryService.uploadFile(imageFile, "temp-gender-check");
            
            if (imageUrl == null || imageUrl.isEmpty()) {
                log.error("Failed to upload image to Cloudinary");
                return null;
            }

            // Build request body
            // Model apna-mart/face-match yêu cầu image1 và image2 (2 ảnh để so sánh)
            // Để detect gender từ 1 ảnh, ta gửi cùng 1 ảnh cho cả image1 và image2
            Map<String, Object> input = new HashMap<>();
            input.put("image1", imageUrl);
            input.put("image2", imageUrl); // Gửi cùng ảnh để self-comparison

            Map<String, Object> body = new HashMap<>();
            body.put("version", faceMatchVersion);
            body.put("input", input);

            log.info("Calling Replicate face-match API with image URL (as image1 and image2): {}", imageUrl);

            // Call Replicate API
            ReplicateFaceMatchResponse response = replicateWebClient.post()
                    .uri("/predictions")
                    .header("Prefer", "wait=30")
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, resp ->
                            resp.bodyToMono(String.class)
                                    .flatMap(b -> {
                                        log.error("Replicate API error: {}", b);
                                        return Mono.error(new RuntimeException("Replicate API error: " + b));
                                    })
                    )
                    .bodyToMono(ReplicateFaceMatchResponse.class)
                    .block();

            if (response == null) {
                log.error("No response from Replicate API");
                return null;
            }

            log.info("Initial response status: {}, id: {}", response.getStatus(), response.getId());

            // Nếu output chưa có (status = "starting" hoặc "processing"), cần poll
            Object output = response.getOutput();
            if (output == null) {
                String status = response.getStatus();
                String predictionId = response.getId();
                
                log.info("Output not available yet. Status: {}, Prediction ID: {}. Starting polling...", status, predictionId);
                
                if (predictionId == null || predictionId.isEmpty()) {
                    log.error("No prediction ID in response");
                    return null;
                }

                // Poll để lấy kết quả
                long start = System.currentTimeMillis();
                long timeoutMs = 60_000; // 60 giây timeout
                int pollIntervalMs = 2000; // Poll mỗi 2 giây

                while (System.currentTimeMillis() - start < timeoutMs) {
                    try {
                        Thread.sleep(pollIntervalMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        log.error("Polling interrupted");
                        break;
                    }

                    log.info("Polling prediction status... (elapsed: {}ms)", System.currentTimeMillis() - start);
                    
                    response = replicateWebClient.get()
                            .uri("/predictions/" + predictionId)
                            .retrieve()
                            .onStatus(HttpStatusCode::isError, resp ->
                                    resp.bodyToMono(String.class)
                                            .flatMap(b -> {
                                                log.error("Replicate polling error: {}", b);
                                                return Mono.error(new RuntimeException("Replicate polling error: " + b));
                                            })
                            )
                            .bodyToMono(ReplicateFaceMatchResponse.class)
                            .block();

                    if (response == null) {
                        log.warn("No response during polling, continuing...");
                        continue;
                    }

                    status = response.getStatus();
                    output = response.getOutput();
                    
                    log.info("Poll response - Status: {}, Has output: {}", status, output != null);

                    // Nếu đã hoàn thành (succeeded, failed, canceled) thì dừng
                    if ("succeeded".equalsIgnoreCase(status) 
                            || "failed".equalsIgnoreCase(status) 
                            || "canceled".equalsIgnoreCase(status)) {
                        log.info("Prediction completed with status: {}", status);
                        break;
                    }
                }

                // Kiểm tra lại output sau khi poll
                if (output == null) {
                    log.error("No output after polling. Final status: {}", response.getStatus());
                    if (response.getError() != null) {
                        log.error("Replicate error: {}", response.getError());
                    }
                    return null;
                }
            }

            log.info("Replicate API output type: {}, value: {}", output.getClass().getName(), output);

            // Parse output (có thể là String JSON hoặc Map)
            // Response structure: { "image1": { "gender": "Female", ... }, "image2": { ... }, ... }
            String gender = null;
            if (output instanceof String) {
                try {
                    String outputStr = (String) output;
                    log.info("Parsing output as JSON string: {}", outputStr);
                    JsonNode outputJson = objectMapper.readTree(outputStr);
                    
                    // Thử lấy từ image1.gender (ảnh đầu tiên được upload)
                    JsonNode image1 = outputJson.path("image1");
                    if (!image1.isMissingNode() && !image1.isNull()) {
                        gender = image1.path("gender").asText();
                        log.info("Found gender in image1: {}", gender);
                    }
                    
                    // Nếu không có image1, thử lấy từ root level
                    if (gender == null || gender.isEmpty() || gender.equals("null")) {
                        gender = outputJson.path("gender").asText();
                        log.info("Trying root level gender: {}", gender);
                    }
                    
                    // Log toàn bộ structure để debug
                    log.info("Full output JSON structure: {}", outputJson.toPrettyString());
                } catch (Exception e) {
                    log.error("Could not parse output as JSON: {}", e.getMessage(), e);
                    log.error("Raw output string: {}", output);
                }
            } else if (output instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> outputMap = (Map<String, Object>) output;
                log.info("Parsing output as Map: {}", outputMap);
                
                // Thử lấy từ image1.gender
                Object image1Obj = outputMap.get("image1");
                if (image1Obj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> image1Map = (Map<String, Object>) image1Obj;
                    gender = (String) image1Map.get("gender");
                    log.info("Found gender in image1 Map: {}", gender);
                }
                
                // Nếu không có image1, thử lấy từ root level
                if (gender == null || gender.isEmpty()) {
                    gender = (String) outputMap.get("gender");
                    log.info("Trying root level gender from Map: {}", gender);
                }
            } else {
                log.warn("Unexpected output type: {}, value: {}", output.getClass().getName(), output);
            }

            log.info("Final detected gender (before normalize): {}", gender);

            // Normalize gender
            // ⚠️ QUAN TRỌNG: Check "female" TRƯỚC "male" vì "female" chứa chuỗi "male"!
            if (gender != null && !gender.isEmpty()) {
                String lowerGender = gender.toLowerCase().trim();
                
                // Check female trước (vì "female" chứa "male")
                if (lowerGender.contains("female") || lowerGender.contains("nữ") || lowerGender.equals("f") || lowerGender.equals("woman") || lowerGender.equals("girl")) {
                    log.info("Normalized gender: female (from: {})", gender);
                    return "female";
                } 
                // Sau đó mới check male
                else if (lowerGender.contains("male") || lowerGender.contains("nam") || lowerGender.equals("m") || lowerGender.equals("man") || lowerGender.equals("boy")) {
                    log.info("Normalized gender: male (from: {})", gender);
                    return "male";
                } else {
                    log.warn("Unknown gender format: {}", gender);
                }
            }

            log.warn("Could not normalize gender, returning null");
            return null;

        } catch (Exception e) {
            log.error("Error calling Replicate API", e);
            return null;
        }
    }

    /**
     * Kiểm tra xem ảnh có khớp với category không
     * @param imageFile File ảnh
     * @param categoryGender "male" hoặc "female" hoặc null (nếu category không phải Nam/Nữ)
     * @return true nếu khớp hoặc không thể kiểm tra, false nếu không khớp
     */
    public boolean validateImageGender(MultipartFile imageFile, String categoryGender) {
        log.info("=== Starting gender validation ===");
        log.info("Category gender: {}", categoryGender);
        
        // Nếu category không phải Nam/Nữ thì không cần kiểm tra
        if (categoryGender == null) {
            log.info("Category is not gender-specific, allowing upload");
            return true;
        }

        String detectedGender = detectGender(imageFile);
        log.info("Detected gender from image: {}", detectedGender);
        
        // Nếu không detect được thì cho phép (tránh false positive)
        // TODO: Có thể thay đổi logic này để strict hơn nếu cần
        if (detectedGender == null) {
            log.warn("⚠️ Could not detect gender in image, allowing upload (to avoid false positive)");
            return true;
        }

        // Kiểm tra khớp
        boolean matches = detectedGender.equals(categoryGender);
        log.info("Gender match result: detected={}, expected={}, matches={}", 
                detectedGender, categoryGender, matches);
        
        if (!matches) {
            log.error("❌ Gender mismatch: detected={}, expected={}. Image will be REJECTED.", 
                    detectedGender, categoryGender);
        } else {
            log.info("✅ Gender match: detected={}, expected={}. Image is VALID.", 
                    detectedGender, categoryGender);
        }

        return matches;
    }

    /**
     * DTO cho response từ Replicate API
     */
    private static class ReplicateFaceMatchResponse {
        private String id;
        private String status;
        private Object output; // Có thể là String hoặc Map
        private String error;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Object getOutput() {
            return output;
        }

        public void setOutput(Object output) {
            this.output = output;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
}

