package com.medsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@EnableJpaAuditing           // activates createdAt / updatedAt in BaseEntity
@EnableConfigurationProperties
public class MedsphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedsphereApplication.class, args);
    }
}