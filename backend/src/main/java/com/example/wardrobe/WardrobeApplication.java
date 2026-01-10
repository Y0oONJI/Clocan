package com.example.wardrobe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Closet Canvas 백엔드 애플리케이션 메인 클래스
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class WardrobeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WardrobeApplication.class, args);
    }

}

