package com.medsphere.modules.ai.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class AiServiceConfig {

    /**
     * RestTemplate riêng để gọi ai-service (FastAPI). Đặt timeout rõ ràng để
     * tránh 1 request AI bị treo vô thời hạn làm nghẽn thread pool của backend.
     */
    @Bean
    public RestTemplate aiServiceRestTemplate(RestTemplateBuilder builder) {
        return builder
                .connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(60)) // AI trả lời có thể mất vài chục giây
                .build();
    }
}