package com.example.wardrobe.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Feature1 컨트롤러
 * 
 * Feature1 관련 API 엔드포인트를 제공합니다.
 * 추천 기능의 핑(ping) 엔드포인트를 포함합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@RestController
@RequestMapping("/api/v1/feature1")
public class Feature1Controller {

    /**
     * Feature1 핑 엔드포인트
     * 
     * API 연결 상태를 확인하는 엔드포인트입니다.
     * 프론트엔드와의 통신 테스트용으로 사용됩니다.
     * 
     * @return API 응답 (ok, message 포함)
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("message", "추천 완료");
        response.put("data", Map.of(
            "style", "캐주얼",
            "items", new String[]{"아이템1", "아이템2", "아이템3"}
        ));
        
        // UTF-8 인코딩을 명시적으로 설정 (WebMvcConfig에서도 전역 설정됨)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8));
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(response);
    }
}

