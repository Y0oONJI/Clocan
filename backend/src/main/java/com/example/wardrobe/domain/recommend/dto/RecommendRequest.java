package com.example.wardrobe.domain.recommend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 스타일 추천 요청 DTO
 * 
 * 사용자의 선호도 정보를 담는 요청 객체입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendRequest {

    /**
     * 사용자 선호도 목록
     * 최소 1개 이상의 선호도가 필요합니다.
     */
    @NotEmpty(message = "선호도 목록은 필수이며 최소 1개 이상이어야 합니다")
    private List<String> preferences;
}

