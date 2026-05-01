package com.tlcn.fashion_api.ai.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Google Gemini provider — sử dụng Generative Language REST API.
 * <p>
 * Free-tier (AI Studio key):
 * <ul>
 *   <li>gemini-2.0-flash-lite — 30 RPM, 1 500 RPD (rất phù hợp cho đồ án)</li>
 *   <li>Lấy key: <a href="https://aistudio.google.com/apikey">https://aistudio.google.com/apikey</a></li>
 * </ul>
 * Endpoint: {@code POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=API_KEY}
 */
@Component
@Qualifier("gemini")
@Slf4j
public class GeminiProvider implements AIProvider {

    private static final String BASE_URL = "https://generativelanguage.googleapis.com";
    private static final String PATH_TEMPLATE = "/v1beta/models/%s:generateContent";

    private final WebClient webClient;
    private final String apiKey;
    private final String model;

    public GeminiProvider(
            Environment env,
            @Value("${ai.gemini.model:gemini-2.0-flash-lite}") String model
    ) {
        this.model = model;
        String raw = env.getProperty("ai.gemini.api-key");
        this.apiKey = raw != null ? raw.trim() : "";
        this.webClient = WebClient.builder()
                .baseUrl(BASE_URL)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();

        if (!StringUtils.hasText(this.apiKey)) {
            log.warn("GeminiProvider — api key chưa đặt. Đặt GEMINI_API_KEY hoặc ai.gemini.api-key "
                    + "trong application-local.properties. Lấy key miễn phí tại https://aistudio.google.com/apikey");
        } else {
            log.info("GeminiProvider — model={}", model);
        }
    }

    /** Trả {@code true} nếu key đã cấu hình và provider có thể dùng. */
    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    @Override
    public ChatCompletion complete(List<Message> messages, CompletionOptions options) {
        if (!StringUtils.hasText(apiKey)) {
            throw new BadRequestException(
                    "Gemini API key chưa được cấu hình. Lấy key miễn phí tại https://aistudio.google.com/apikey "
                    + "rồi đặt ai.gemini.api-key trong application-local.properties."
            );
        }

        long start = System.currentTimeMillis();
        Map<String, Object> body = buildRequestBody(messages, options);
        String path = PATH_TEMPLATE.formatted(model);

        try {
            GeminiResponse resp = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(path)
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            cr -> cr.bodyToMono(String.class).map(errBody -> {
                                log.error("Gemini API {}: {}", cr.statusCode().value(), errBody);
                                return new BadRequestException(mapGeminiError(errBody));
                            }))
                    .bodyToMono(GeminiResponse.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

            String text = extractText(resp);
            if (text == null || text.isBlank()) {
                throw new BadRequestException("Gemini trả về nội dung trống.");
            }

            int inTok  = resp != null && resp.usageMetadata() != null
                    ? resp.usageMetadata().promptTokenCount() : 0;
            int outTok = resp != null && resp.usageMetadata() != null
                    ? resp.usageMetadata().candidatesTokenCount() : 0;
            log.debug("Gemini — model={}, inTok={}, outTok={}, latency={}ms",
                    model, inTok, outTok, System.currentTimeMillis() - start);

            return new ChatCompletion(text, inTok, outTok, "gemini/" + model);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini error after {}ms: {}", System.currentTimeMillis() - start, e.getMessage(), e);
            throw new BadRequestException("Không thể kết nối Gemini. Vui lòng thử lại sau.");
        }
    }

    // -----------------------------------------------------------------------
    // Request builder
    // -----------------------------------------------------------------------

    private static Map<String, Object> buildRequestBody(List<Message> messages, CompletionOptions opts) {
        Map<String, Object> body = new HashMap<>();

        // Tách system prompt riêng (Gemini hỗ trợ systemInstruction)
        List<Message> rest = new ArrayList<>();
        for (Message m : messages) {
            if ("system".equalsIgnoreCase(m.role())) {
                body.put("system_instruction", Map.of(
                        "parts", List.of(Map.of("text", m.content()))
                ));
            } else {
                rest.add(m);
            }
        }

        List<Map<String, Object>> contents = new ArrayList<>();
        for (Message m : rest) {
            String geminiRole = "assistant".equalsIgnoreCase(m.role()) ? "model" : "user";
            contents.add(Map.of(
                    "role", geminiRole,
                    "parts", List.of(Map.of("text", m.content()))
            ));
        }
        body.put("contents", contents);

        body.put("generationConfig", Map.of(
                "maxOutputTokens", opts.maxTokens(),
                "temperature", opts.temperature()
        ));
        return body;
    }

    private static String extractText(GeminiResponse resp) {
        if (resp == null || resp.candidates() == null) return null;
        for (Candidate c : resp.candidates()) {
            if (c.content() == null || c.content().parts() == null) continue;
            for (Part p : c.content().parts()) {
                if (p.text() != null && !p.text().isBlank()) return p.text().trim();
            }
        }
        return null;
    }

    private static String mapGeminiError(String body) {
        if (body == null || body.isBlank()) return "Gemini từ chối yêu cầu.";
        if (body.contains("API_KEY_INVALID") || body.contains("API key not valid")) {
            return "Gemini API key không hợp lệ. Kiểm tra ai.gemini.api-key / GEMINI_API_KEY.";
        }
        if (body.contains("RESOURCE_EXHAUSTED") || body.contains("quota")) {
            return "Gemini đã vượt quá quota miễn phí hôm nay. Thử lại vào ngày mai hoặc nâng gói.";
        }
        if (body.length() > 400) return "Lỗi từ Gemini (xem log server).";
        return "Lỗi Gemini: " + body;
    }

    // -----------------------------------------------------------------------
    // JSON DTOs
    // -----------------------------------------------------------------------

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiResponse(
            List<Candidate> candidates,
            @JsonProperty("usageMetadata") UsageMetadata usageMetadata
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Candidate(Content content, String finishReason) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Content(String role, List<Part> parts) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Part(String text) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record UsageMetadata(
            @JsonProperty("promptTokenCount") int promptTokenCount,
            @JsonProperty("candidatesTokenCount") int candidatesTokenCount,
            @JsonProperty("totalTokenCount") int totalTokenCount
    ) {}
}
