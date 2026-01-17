package com.example.wardrobe.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping
    public Map<String, Object> health() {
        return Map.of(
                "status", "OK",
                "timestamp", OffsetDateTime.now().toString(),
                "app", "wardrobe-backend",
                "version", "0.0.1",
                "env", "local"
        );
    }
}

@RestController
class RootHealthController {
    
    /**
     * Cloud Type 헬스체크용 루트 경로
     * Cloud Type은 기본적으로 /health 또는 / 경로를 확인합니다.
     */
    @GetMapping({"/", "/health", "/healthz"})
    public ResponseEntity<Map<String, Object>> rootHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "wardrobe-backend",
                "timestamp", OffsetDateTime.now().toString()
        ));
    }
}