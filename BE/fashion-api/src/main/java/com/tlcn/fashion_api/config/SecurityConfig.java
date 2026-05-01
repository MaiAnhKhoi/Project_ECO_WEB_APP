package com.tlcn.fashion_api.config;

import com.tlcn.fashion_api.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Reviews (PHẢI đặt ĐẦU TIÊN để match trước)
                        .requestMatchers("/api/reviews/public/testimonials").permitAll()
                        .requestMatchers("/api/reviews/public/**").permitAll()
                        .requestMatchers("/api/reviews/product/**").permitAll()
                        
                        // Public endpoints - Authentication
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/refresh-token").permitAll()
                        .requestMatchers("/api/auth/verify-email", "/api/auth/resend-verification").permitAll()
                        .requestMatchers("/api/auth/forgot-password", "/api/auth/reset-password").permitAll()

                        // Public endpoints - Product HOME API
                        .requestMatchers("/api/products/**").permitAll()

                        //Public endpoints - Banner home
                        .requestMatchers("/api/banners/**").permitAll()

                        //Public endpoints - Category
                        .requestMatchers("/api/categories/**").permitAll()

                        .requestMatchers("/api/cart/**").permitAll()
                        .requestMatchers("/api/compare/**").permitAll()
                        .requestMatchers("/api/blogs/**").permitAll()

                        //Public endpoints
                        .requestMatchers("/api/brands/**").permitAll()

                        .requestMatchers("/api/filters/**").permitAll()

                        .requestMatchers("/api/contact-info").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contact-messages").permitAll()

                        // Public endpoints - Invitation acceptance
                        .requestMatchers(HttpMethod.POST, "/api/roles/invitations/*/accept").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/roles/invitations/*/accept").permitAll()

                        // Swagger/OpenAPI
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Actuator health endpoint
                        .requestMatchers("/actuator/health").permitAll()

                        // WebSocket chat (SockJS handshake & info endpoints)
                        .requestMatchers("/ws-chat/**").permitAll()

                        // -------------------------------------------------------
                        // AI endpoints — public (userId optional; auth enriches context)
                        // -------------------------------------------------------
                        // POST /api/ai/chat handled by AiChatServletRouter (RouterFunction)
                        .requestMatchers(HttpMethod.POST, "/api/ai/chat").permitAll()
                        // Outfit + product recommendations — public
                        .requestMatchers(HttpMethod.POST, "/api/ai/recommend/outfit").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/ai/recommend/products").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/ai/recommend/trending").permitAll()
                        // Behavior tracking — fire-and-forget, no auth required
                        .requestMatchers(HttpMethod.POST, "/api/ai/behavior/track").permitAll()
                        // Chat history + conversation detail — require auth (handled in controller)
                        .requestMatchers(HttpMethod.GET,  "/api/ai/chat/conversation/**").permitAll()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}