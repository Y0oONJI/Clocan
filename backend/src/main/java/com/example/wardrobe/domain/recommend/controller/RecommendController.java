package com.example.wardrobe.domain.recommend.controller;

import com.example.wardrobe.domain.recommend.dto.RecommendRequest;
import com.example.wardrobe.domain.recommend.dto.RecommendResponse;
import com.example.wardrobe.domain.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 스타일 추천 컨트롤러
 * 
 * 사용자의 선호도 기반 스타일 추천 API를 제공합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@RestController
@RequestMapping(value = "/api/v1", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /**
     * 스타일 추천 요청 처리
     * 
     * @param request 사용자 선호도 정보
     * @return 추천 결과
     */
    @PostMapping("/recommend")
    public ResponseEntity<RecommendResponse> recommend(
            @RequestBody RecommendRequest request
    ) {
        RecommendResponse response = recommendService.recommend(request);
        return ResponseEntity.ok(response);
    }
}

