package com.tlcn.fashion_api.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payos")
@Getter
@Setter
public class PayOSConfig {
    private String clientId;
    private String apiKey;
    private String checksumKey;
    private String returnUrl;
    private String cancelUrl;

    @PostConstruct
    public void debug() {
        System.out.println("========== PAYOS CONFIG LOADED ==========");
        System.out.println("clientId      = " + clientId);
        System.out.println("apiKey        = " + apiKey);
        System.out.println("checksumKey   = " + checksumKey);
        System.out.println("returnUrl     = " + returnUrl);
        System.out.println("cancelUrl     = " + cancelUrl);
        System.out.println("==========================================");
    }
}
