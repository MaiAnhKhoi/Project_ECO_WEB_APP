package com.tlcn.fashion_api.ai.provider;

import com.tlcn.fashion_api.common.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Provider tổng hợp: thử OpenAI trước, tự động chuyển sang Gemini khi:
 * <ul>
 *   <li>OpenAI key chưa cấu hình</li>
 *   <li>OpenAI trả lỗi 429 (quota / rate-limit)</li>
 *   <li>OpenAI ném bất kỳ ngoại lệ nào</li>
 * </ul>
 *
 * <p>Ưu tiên: OpenAI → Gemini → lỗi rõ ràng cho client</p>
 */
@Component
@Primary
@Slf4j
public class CompositeAIProvider implements AIProvider {

    private final OpenAIProvider openAI;
    private final GeminiProvider gemini;

    public CompositeAIProvider(
            @Qualifier("openai") OpenAIProvider openAI,
            @Qualifier("gemini") GeminiProvider gemini
    ) {
        this.openAI  = openAI;
        this.gemini  = gemini;
    }

    @Override
    public ChatCompletion complete(List<Message> messages, CompletionOptions options) {

        // Nếu OpenAI key đã cấu hình → thử OpenAI trước
        if (openAI.isConfigured()) {
            try {
                ChatCompletion result = openAI.complete(messages, options);
                log.debug("CompositeAIProvider — dùng OpenAI thành công");
                return result;
            } catch (BadRequestException e) {
                String msg = e.getMessage() != null ? e.getMessage() : "";
                boolean shouldFallback = msg.contains("quota")
                        || msg.contains("rate_limit")
                        || msg.contains("insufficient")
                        || msg.contains("billing")
                        || msg.contains("429");
                if (!shouldFallback) {
                    // Lỗi do input không hợp lệ — không fallback, trả thẳng cho client
                    throw e;
                }
                log.warn("OpenAI không khả dụng (quota/rate-limit), chuyển sang Gemini. Lý do: {}", msg);
            } catch (Exception e) {
                log.warn("OpenAI lỗi không xác định ({}), chuyển sang Gemini.", e.getMessage());
            }
        } else {
            log.debug("OpenAI chưa cấu hình — dùng Gemini trực tiếp");
        }

        // Fallback: Gemini
        if (gemini.isConfigured()) {
            try {
                ChatCompletion result = gemini.complete(messages, options);
                log.debug("CompositeAIProvider — dùng Gemini fallback thành công");
                return result;
            } catch (BadRequestException e) {
                throw e;
            } catch (Exception e) {
                log.error("Gemini fallback cũng lỗi: {}", e.getMessage(), e);
                throw new BadRequestException("Không thể kết nối với AI service lúc này. Vui lòng thử lại sau.");
            }
        }

        // Cả hai đều chưa cấu hình
        throw new BadRequestException(
                "Chưa cấu hình AI provider nào. "
                + "Đặt OPENAI_API_KEY hoặc GEMINI_API_KEY (lấy miễn phí tại https://aistudio.google.com/apikey) "
                + "trong biến môi trường hoặc application-local.properties."
        );
    }
}
