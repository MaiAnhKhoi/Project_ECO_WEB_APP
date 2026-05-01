package com.tlcn.fashion_api.config;

import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.ai.ChatRequest;
import com.tlcn.fashion_api.dto.response.ai.ChatResponse;
import com.tlcn.fashion_api.security.JwtService;
import com.tlcn.fashion_api.service.ai.AiChatbotService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.servlet.function.RequestPredicates.POST;
import static org.springframework.web.servlet.function.RouterFunctions.route;

/**
 * POST {@code /api/ai/chat} đăng ký qua {@link RouterFunction}; {@link org.springframework.web.servlet.handler.RouterFunctionMapping}
 * có thứ tự cao hơn {@code RequestMappingHandlerMapping}, tránh trường hợp endpoint chỉ rơi vào {@code ResourceHttpRequestHandler}.
 */
@Configuration
@RequiredArgsConstructor
public class AiChatServletRouter {

    private final AiChatbotService chatbotService;
    private final JwtService jwtService;
    private final Validator validator;

    @Bean
    public RouterFunction<ServerResponse> aiChatPostRoute() {
        return route(POST("/api/ai/chat"), request -> {
            ChatRequest body = request.body(ChatRequest.class);

            Set<ConstraintViolation<ChatRequest>> violations = validator.validate(body);
            if (!violations.isEmpty()) {
                String msg = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.joining("; "));
                return ServerResponse.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.error(msg));
            }

            String auth = request.headers().firstHeader(HttpHeaders.AUTHORIZATION);
            Long userId = extractUserId(auth);

            try {
                ChatResponse response = chatbotService.chat(body, userId);
                return ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.success(response, "Chatbot phản hồi thành công"));
            } catch (BadRequestException e) {
                return ServerResponse.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.error(e.getMessage()));
            }
        });
    }

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            String token = authHeader.substring(7);
            return jwtService.getUserIdFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }
}
