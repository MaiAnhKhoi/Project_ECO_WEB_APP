package com.tlcn.fashion_api.ai.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * OpenAI Responses API — {@code POST /v1/responses}
 *
 * <p>Format request giống 100% Postman:
 * <pre>
 * {
 *   "model":        "gpt-5.4-mini",
 *   "instructions": "Bạn là trợ lý...",   // system prompt — field riêng
 *   "input":        "Xin chào",             // chỉ nội dung user / hội thoại
 *   "max_output_tokens": 1024
 * }
 * </pre>
 *
 * <p>Response structure được parse:
 * <pre>
 * response.output[0].content[0].text
 * </pre>
 */
@Component
@Qualifier("openai")
@Slf4j
public class OpenAIProvider implements AIProvider {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final WebClient webClient;
    private final String apiKey;

    @Value("${ai.openai.model:gpt-5.4-mini}")
    private String model;

    @Value("${ai.openai.max-retry:2}")
    private int maxRetry;

    private final String responsesPath;

    public OpenAIProvider(
            Environment env,
            @Value("${ai.openai.base-url:https://api.openai.com/v1}") String baseUrl,
            @Value("${ai.openai.timeout-seconds:30}") int timeoutSeconds,
            @Value("${ai.openai.responses-path:/responses}") String responsesPath
    ) {
        this.responsesPath = responsesPath;

        String raw = env.getProperty("ai.openai.api-key");
        this.apiKey   = raw != null ? raw.trim() : "";

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + this.apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();

        if (!StringUtils.hasText(this.apiKey)) {
            log.warn("[OpenAI] API key CHƯA CẤU HÌNH — set OPENAI_API_KEY (env) "
                    + "hoặc ai.openai.api-key trong application-local.properties");
        } else {
            log.info("[OpenAI] Khởi tạo OK — baseUrl={} path={}", baseUrl, responsesPath);
        }
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /** Trả {@code true} nếu API key đã được cấu hình. */
    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    @Override
    public ChatCompletion complete(List<Message> messages, CompletionOptions options) {
        if (!StringUtils.hasText(apiKey)) {
            throw new BadRequestException(
                    "[OpenAI] API key chưa cấu hình. Đặt OPENAI_API_KEY (env) hoặc ai.openai.api-key trong application-local.properties."
            );
        }

        long start = System.currentTimeMillis();

        // Tách system prompt ra field `instructions` — đúng format Responses API
        String instructions = extractSystemPrompt(messages);
        String input        = buildUserInput(messages);

        Map<String, Object> requestBody = buildRequestBody(instructions, input, options);
        String requestJson = toJson(requestBody);

        // ---- LOG REQUEST ----
        log.info("[OpenAI] → POST {}{} | model={} | body={}",
                webClient, responsesPath, requestBody.get("model"),
                requestJson.length() > 500 ? requestJson.substring(0, 500) + "…" : requestJson);

        try {
            OpenAiResponsesApiResponse response = webClient.post()
                    .uri(responsesPath)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, cr ->
                            cr.bodyToMono(String.class).map(body -> {
                                log.error("[OpenAI] ← {} | body={}", cr.statusCode().value(), body);
                                return new BadRequestException(humanizeError(body));
                            })
                    )
                    .onStatus(HttpStatusCode::is5xxServerError, cr ->
                            cr.bodyToMono(String.class).map(body -> {
                                log.error("[OpenAI] ← SERVER ERROR {} | body={}", cr.statusCode().value(), body);
                                return new RuntimeException("OpenAI server error: " + body);
                            })
                    )
                    .bodyToMono(OpenAiResponsesApiResponse.class)
                    .retryWhen(Retry.backoff(maxRetry, Duration.ofSeconds(2))
                            .filter(t -> !(t instanceof BadRequestException)))
                    .timeout(Duration.ofSeconds(120))
                    .block();

            // ---- LOG RESPONSE ----
            long latency = System.currentTimeMillis() - start;
            if (response == null) {
                log.error("[OpenAI] ← response NULL sau {}ms", latency);
                throw new BadRequestException("OpenAI returned empty response");
            }

            String content = extractOutputText(response);
            if (content == null || content.isBlank()) {
                log.error("[OpenAI] ← output trống — raw response: {}", toJson(response));
                throw new BadRequestException("OpenAI returned no output text");
            }

            int inTok  = response.usage() != null ? Objects.requireNonNullElse(response.usage().inputTokens(), 0) : 0;
            int outTok = response.usage() != null ? Objects.requireNonNullElse(response.usage().outputTokens(), 0) : 0;
            log.info("[OpenAI] ← OK {}ms | model={} | inTok={} outTok={} | preview={}",
                    latency,
                    response.model() != null ? response.model() : model,
                    inTok, outTok,
                    content.length() > 120 ? content.substring(0, 120) + "…" : content);

            return new ChatCompletion(content, inTok, outTok,
                    response.model() != null ? response.model() : model);

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            log.error("[OpenAI] ← EXCEPTION sau {}ms — {}: {}", latency, e.getClass().getSimpleName(), e.getMessage(), e);
            throw new BadRequestException("Không thể kết nối AI service. Vui lòng thử lại sau.");
        }
    }

    // -----------------------------------------------------------------------
    // Request builder — format 100% giống Postman
    // -----------------------------------------------------------------------

    private Map<String, Object> buildRequestBody(String instructions, String input, CompletionOptions opts) {
        Map<String, Object> body = new LinkedHashMap<>();   // giữ thứ tự field như Postman
        body.put("model", model);
        if (StringUtils.hasText(instructions)) {
            body.put("instructions", instructions);         // system prompt — đúng field Responses API
        }
        body.put("input", input);                           // chỉ user/assistant turns
        body.put("max_output_tokens", opts.maxTokens());
        return body;
    }

    /** Lấy nội dung message role=system (đầu tiên tìm thấy). */
    private static String extractSystemPrompt(List<Message> messages) {
        return messages.stream()
                .filter(m -> "system".equalsIgnoreCase(m.role()))
                .map(Message::content)
                .findFirst()
                .orElse(null);
    }

    /**
     * Ghép các turn user/assistant thành chuỗi input.
     * Responses API nhận string → coi như lượt user cuối cùng.
     * Nếu có nhiều turn → ghép thành hội thoại plaintext.
     */
    private static String buildUserInput(List<Message> messages) {
        List<Message> turns = messages.stream()
                .filter(m -> !"system".equalsIgnoreCase(m.role()))
                .toList();

        if (turns.isEmpty()) return "";
        if (turns.size() == 1) return turns.get(0).content(); // simple string — giống Postman

        // Multi-turn: ghép thành text rõ role
        StringBuilder sb = new StringBuilder();
        for (Message m : turns) {
            String label = "assistant".equalsIgnoreCase(m.role()) ? "Assistant" : "User";
            sb.append(label).append(": ").append(m.content()).append("\n");
        }
        return sb.toString().trim();
    }

    // -----------------------------------------------------------------------
    // Response parser — output[0].content[0].text
    // -----------------------------------------------------------------------

    private static String extractOutputText(OpenAiResponsesApiResponse resp) {
        if (resp.output() == null) return null;
        List<String> parts = new ArrayList<>();
        for (OutputMessageBlock block : resp.output()) {
            if (block == null || block.content() == null) continue;
            for (OutputContentPiece piece : block.content()) {
                if (piece != null && "output_text".equals(piece.type())
                        && StringUtils.hasText(piece.text())) {
                    parts.add(piece.text());
                }
            }
        }
        return parts.isEmpty() ? null : String.join("", parts);
    }

    // -----------------------------------------------------------------------
    // Error message helpers
    // -----------------------------------------------------------------------

    private static String humanizeError(String body) {
        if (!StringUtils.hasText(body)) return "OpenAI từ chối yêu cầu (body trống).";
        if (body.contains("insufficient_quota"))
            return "OpenAI key hết quota — kiểm tra billing tại https://platform.openai.com/account/billing";
        if (body.contains("rate_limit") || body.contains("Rate limit"))
            return "OpenAI rate-limit — thử lại sau vài giây.";
        if (body.contains("invalid_api_key") || body.contains("Incorrect API key"))
            return "OpenAI API key không hợp lệ — kiểm tra OPENAI_API_KEY / ai.openai.api-key.";
        if (body.contains("model_not_found") || body.contains("does not exist"))
            return "Model không tồn tại — kiểm tra ai.openai.model trong application.properties.";
        if (body.length() > 400) return "Lỗi OpenAI (xem log server).";
        return "OpenAI lỗi: " + body;
    }

    private static String toJson(Object obj) {
        try { return MAPPER.writeValueAsString(obj); }
        catch (JsonProcessingException e) { return obj.toString(); }
    }

    // -----------------------------------------------------------------------
    // JSON DTOs — Responses API
    // -----------------------------------------------------------------------

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenAiResponsesApiResponse(
            String id,
            String model,
            String status,
            List<OutputMessageBlock> output,
            ResponsesUsage usage
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OutputMessageBlock(
            String id,
            String type,
            String role,
            String status,
            List<OutputContentPiece> content
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OutputContentPiece(
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
