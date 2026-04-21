package com.tlcn.fashion_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // nếu cần thì chỉnh domain
                .withSockJS();                 // dùng SockJS cho FE
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // FE subscribe các topic bắt đầu bằng /topic
        registry.enableSimpleBroker("/topic");
        // (nếu sau này có gửi từ FE -> BE thì dùng prefix /app)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
