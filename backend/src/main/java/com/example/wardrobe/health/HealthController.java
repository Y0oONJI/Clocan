package com.example.wardrobe.health;

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