package com.example.wardrobe.domain.recommend.service;

import com.example.wardrobe.domain.recommend.dto.RecommendRequest;
import com.example.wardrobe.domain.recommend.dto.RecommendResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 스타일 추천 서비스
 * 
 * 사용자의 선호도를 기반으로 스타일을 추천합니다.
 * 현재는 Mock 데이터를 반환하며, 향후 실제 AI 추천 로직으로 교체될 예정입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendService {

    /**
     * 사용자 선호도 기반 스타일 추천
     * 
     * @param request 사용자 선호도 정보
     * @return 추천 결과 (스타일, 메시지, 아이템 목록)
     * @throws IllegalArgumentException 선호도 목록이 비어있는 경우
     */
    @Transactional
    public RecommendResponse recommend(RecommendRequest request) {
        // 입력값 검증
        if (request.getPreferences() == null || request.getPreferences().isEmpty()) {
            throw new IllegalArgumentException("선호도 목록이 비어있습니다");
        }

        // ⭐ 현재는 강의용 Mock 데이터 반환
        // TODO: 실제 AI 추천 로직으로 교체 필요
        String style = "캐주얼";
        String message = "사용자님은 캐주얼 스타일이에요!";

        return new RecommendResponse(
                true,
                style,
                message,
                List.of("아이템1", "아이템2", "아이템3")
        );
    }
}

