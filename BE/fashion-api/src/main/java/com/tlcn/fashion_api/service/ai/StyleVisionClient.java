package com.tlcn.fashion_api.service.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Gọi OpenAI Responses API ({@code POST /v1/responses}) để phân tích ảnh người dùng.
 * Dùng cùng endpoint và format với {@link OpenAIProvider} — chỉ khác ở phần input có ảnh.
 *
 * <p>Request format:
 * <pre>
 * {
 *   "model":        "gpt-5.4-mini",
 *   "instructions": "Bạn là chuyên gia...",
 *   "input": [
 *     {
 *       "role": "user",
 *       "content": [
 *         { "type": "input_text",  "text": "Phân tích ảnh này..." },
 *         { "type": "input_image", "image_url": "https://..." }
 *       ]
 *     }
 *   ],
 *   "max_output_tokens": 512,
 *   "text": { "format": { "type": "json_object" } }
 * }
 * </pre>
 *
 * <p>Response được parse từ: {@code output[0].content[0].text}
 */
@Component
@Slf4j
public class StyleVisionClient {

    private static final String RESPONSES_PATH = "/responses";

    private final WebClient webClient;
    private final boolean configured;

    @Value("${ai.openai.model:gpt-5.4-mini}")
    private String model;

    @Value("${ai.openai.timeout-seconds:30}")
    private int timeoutSeconds;

    public StyleVisionClient(
            Environment env,
            @Value("${ai.openai.base-url:https://api.openai.com/v1}") String baseUrl,
            @Value("${ai.openai.responses-path:/responses}") String responsesPath
    ) {
        String rawKey = env.getProperty("ai.openai.api-key");
        String apiKey = rawKey != null ? rawKey.trim() : "";
        this.configured = StringUtils.hasText(apiKey);

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();

        if (!this.configured) {
            log.warn("[StyleVision] OpenAI API key chưa cấu hình — style analysis sẽ không hoạt động");
        } else {
            log.info("[StyleVision] Khởi tạo OK — baseUrl={} path={}", baseUrl, responsesPath);
        }
    }

    /**
     * Phân tích ảnh và trả về JSON raw từ AI.
     *
     * @param imageUrl URL ảnh đã upload (public-accessible, Cloudinary)
     * @return JSON string chứa gender, bodyType, skinTone, recommendedStyle, confidence
     */
    public String analyzeImage(String imageUrl) {
        if (!configured) {
            throw new BadRequestException(
                    "OpenAI API key chưa cấu hình. Đặt OPENAI_API_KEY trong biến môi trường.");
        }

        Map<String, Object> requestBody = buildRequestBody(imageUrl);

        log.info("[StyleVision] → POST {} | model={} | imageUrl={}",
                RESPONSES_PATH, model, imageUrl);
        long start = System.currentTimeMillis();

        try {
            ResponsesApiResponse response = webClient.post()
                    .uri(RESPONSES_PATH)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, resp ->
                            resp.bodyToMono(String.class).map(body -> {
                                log.error("[StyleVision] ← 4xx | body={}", body);
                                return new BadRequestException(humanizeError(body));
                            })
                    )
                    .onStatus(HttpStatusCode::is5xxServerError, resp ->
                            resp.bodyToMono(String.class).map(body -> {
                                log.error("[StyleVision] ← 5xx | body={}", body);
                                return new RuntimeException("OpenAI server error: " + body);
                            })
                    )
                    .bodyToMono(ResponsesApiResponse.class)
                    .timeout(Duration.ofSeconds(Math.max(timeoutSeconds, 60)))
                    .block();

            long latency = System.currentTimeMillis() - start;

            if (response == null) {
                throw new BadRequestException("OpenAI không trả về kết quả phân tích ảnh");
            }

            String content = extractOutputText(response);
            if (!StringUtils.hasText(content)) {
                throw new BadRequestException("OpenAI trả về nội dung rỗng");
            }

            log.info("[StyleVision] ← OK {}ms | model={} | preview={}", latency,
                    response.model() != null ? response.model() : model,
                    content.length() > 200 ? content.substring(0, 200) + "…" : content);

            return content;

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            log.error("[StyleVision] ← EXCEPTION sau {}ms — {}: {}",
                    latency, e.getClass().getSimpleName(), e.getMessage(), e);
            throw new BadRequestException("Không thể phân tích ảnh lúc này. Vui lòng thử lại sau.");
        }
    }

    // -----------------------------------------------------------------------
    // Request builder — Responses API format với image input
    // -----------------------------------------------------------------------

    private Map<String, Object> buildRequestBody(String imageUrl) {
        // Content của user message gồm text + ảnh
        List<Map<String, Object>> userContent = new ArrayList<>();
        userContent.add(Map.of(
                "type", "input_text",
                "text", "Phân tích ảnh người dùng này và trả về JSON như hướng dẫn."
        ));
        userContent.add(Map.of(
                "type", "input_image",
                "image_url", imageUrl
        ));

        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", userContent
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("instructions", buildSystemPrompt());
        body.put("input", List.of(userMessage));
        body.put("max_output_tokens", 512);
        // Yêu cầu output JSON
        body.put("text", Map.of("format", Map.of("type", "json_object")));
        return body;
    }

    // -----------------------------------------------------------------------
    // Response parser — output[0].content[0].text  (giống OpenAIProvider)
    // -----------------------------------------------------------------------

    private static String extractOutputText(ResponsesApiResponse resp) {
        if (resp.output() == null) return null;
        List<String> parts = new ArrayList<>();
        for (OutputBlock block : resp.output()) {
            if (block == null || block.content() == null) continue;
            for (OutputContent piece : block.content()) {
                if (piece != null && "output_text".equals(piece.type())
                        && StringUtils.hasText(piece.text())) {
                    parts.add(piece.text());
                }
            }
        }
        return parts.isEmpty() ? null : String.join("", parts);
    }

    // -----------------------------------------------------------------------
    // Prompt
    // -----------------------------------------------------------------------

    private static String buildSystemPrompt() {
        return """
                Bạn là chuyên gia phân tích phong cách thời trang. Nhiệm vụ QUAN TRỌNG NHẤT là xác định ĐÚNG giới tính để tránh gợi ý sai đồ.

                Phân tích ảnh và trả về JSON hợp lệ CHÍNH XÁC theo schema sau (không thêm text ngoài JSON):

                {
                  "gender": "<BẮT BUỘC: MALE | FEMALE | UNISEX | UNKNOWN>",
                  "genderConfidence": <số thực 0.0-1.0 mức độ chắc chắn về giới tính>,
                  "bodyType": "<Slim | Athletic | Curvy | Petite | Plus-Size>",
                  "skinTone": "<Fair | Light | Medium | Warm | Olive | Dark>",
                  "recommendedStyle": "<Casual | Minimal Casual | Smart Casual | Formal | Streetwear | Bohemian | Sporty | Business Casual>",
                  "styleKeywords": ["<3-5 từ khoá phong cách tiếng Anh phù hợp với giới tính và phong cách>"],
                  "confidence": <số thực 0.0-1.0 độ tin cậy tổng thể>,
                  "notes": "<ghi chú ngắn tiếng Việt tối đa 80 ký tự>"
                }

                QUY TẮC XÁC ĐỊNH GIỚI TÍNH:
                - MALE: rõ ràng là nam giới (khuôn mặt nam, tóc ngắn kiểu nam, quần áo nam rõ ràng)
                - FEMALE: rõ ràng là nữ giới (khuôn mặt nữ, quần áo nữ như váy/đầm, tóc dài/kiểu nữ)
                - UNISEX: quần áo có thể dùng cho cả hai giới, hoặc ảnh chỉ thấy trang phục không thấy người
                - UNKNOWN: ảnh quá mờ / không phải người / không thể xác định giới tính — đặt genderConfidence < 0.5

                Nếu không nhận diện được người trong ảnh → vẫn trả JSON hợp lệ với confidence=0.1, gender=UNKNOWN.
                """;
    }

    // -----------------------------------------------------------------------
    // Error helpers
    // -----------------------------------------------------------------------

    private static String humanizeError(String body) {
        if (!StringUtils.hasText(body)) return "OpenAI từ chối yêu cầu.";
        if (body.contains("insufficient_quota"))
            return "OpenAI key hết quota — kiểm tra billing tại https://platform.openai.com/account/billing";
        if (body.contains("rate_limit") || body.contains("Rate limit"))
            return "OpenAI rate-limit — thử lại sau vài giây.";
        if (body.contains("invalid_api_key") || body.contains("Incorrect API key"))
            return "OpenAI API key không hợp lệ — kiểm tra OPENAI_API_KEY.";
        if (body.contains("model_not_found") || body.contains("does not exist"))
            return "Model không tồn tại — kiểm tra ai.openai.model trong application.properties.";
        if (body.length() > 400) return "Lỗi OpenAI (xem log server).";
        return "OpenAI lỗi: " + body;
    }

    // -----------------------------------------------------------------------
    // Response DTOs — Responses API (giống cấu trúc OpenAIProvider)
    // -----------------------------------------------------------------------

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ResponsesApiResponse(
            String id,
            String model,
            String status,
            List<OutputBlock> output,
            ResponsesUsage usage
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OutputBlock(
            String id,
            String type,
            String role,
            String status,
            List<OutputContent> content
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OutputContent(
            String type,
            String text
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ResponsesUsage(
            @JsonProperty("input_tokens")  Integer inputTokens,
            @JsonProperty("output_tokens") Integer outputTokens,
            @JsonProperty("total_tokens")  Integer totalTokens
    ) {}
}
