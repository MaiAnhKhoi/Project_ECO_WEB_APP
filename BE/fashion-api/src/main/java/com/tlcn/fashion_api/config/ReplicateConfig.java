    package com.tlcn.fashion_api.config;

    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.reactive.function.client.WebClient;

    @Configuration
    public class ReplicateConfig {

        @Value("${replicate.api.token}")
        private String apiToken;

        @Bean
        public WebClient replicateWebClient() {
            return WebClient.builder()
                    .baseUrl("https://api.replicate.com/v1")
                    .defaultHeader("Authorization", "Bearer " + apiToken)
                    .defaultHeader("Content-Type", "application/json")
                    .defaultHeader("Accept", "application/json")
                    .defaultHeader("Prefer", "wait")
                    .build();
        }
    }


