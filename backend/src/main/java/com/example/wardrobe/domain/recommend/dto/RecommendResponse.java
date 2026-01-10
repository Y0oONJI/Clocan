package com.example.wardrobe.domain.recommend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 스타일 추천 응답 DTO
 * 
 * 추천 결과를 담는 응답 객체입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@AllArgsConstructor
public class RecommendResponse {

    /**
     * 추천 성공 여부
     */
    private boolean ok;

    /**
     * 추천된 스타일
     */
    private String style;

    /**
     * 추천 메시지
     */
    private String message;

    /**
     * 추천된 아이템 목록
     */
    private List<String> items;
}

