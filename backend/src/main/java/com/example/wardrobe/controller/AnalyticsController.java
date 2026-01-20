package com.example.wardrobe.controller;

import com.example.wardrobe.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 분석 API 컨트롤러
 * 
 * 어드민 페이지에서 사용할 통계 데이터를 제공합니다.
 * 인증 없이 접근 가능한 공개 API입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    /**
     * 시간대별 집계 응답 DTO
     */
    public static class HourlyAnalyticsResponse {
        private int hour;
        private long count;
        
        public HourlyAnalyticsResponse(int hour, long count) {
            this.hour = hour;
            this.count = count;
        }
        
        public int getHour() {
            return hour;
        }
        
        public void setHour(int hour) {
            this.hour = hour;
        }
        
        public long getCount() {
            return count;
        }
        
        public void setCount(long count) {
            this.count = count;
        }
    }
    
    /**
     * 랜딩 페이지 접속 수 시간대별 조회
     * 
     * GET /api/v1/admin/analytics/landing-page-views
     * 
     * @return 시간대별(0-23) 접속 수 데이터
     */
    @GetMapping("/landing-page-views")
    public ResponseEntity<List<HourlyAnalyticsResponse>> getLandingPageViews() {
        List<AnalyticsService.HourlyAnalytics> data = analyticsService.getLandingPageViews();
        List<HourlyAnalyticsResponse> response = data.stream()
            .map(item -> new HourlyAnalyticsResponse(item.getHour(), item.getCount()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 스타일 퀴즈 완료 수 시간대별 조회
     * 
     * GET /api/v1/admin/analytics/quiz-completions
     * 
     * @return 시간대별(0-23) 완료 수 데이터
     */
    @GetMapping("/quiz-completions")
    public ResponseEntity<List<HourlyAnalyticsResponse>> getQuizCompletions() {
        List<AnalyticsService.HourlyAnalytics> data = analyticsService.getQuizCompletions();
        List<HourlyAnalyticsResponse> response = data.stream()
            .map(item -> new HourlyAnalyticsResponse(item.getHour(), item.getCount()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    /**
     * AI 분석 완료 수 시간대별 조회
     * 
     * GET /api/v1/admin/analytics/analysis-completions
     * 
     * @return 시간대별(0-23) 완료 수 데이터
     */
    @GetMapping("/analysis-completions")
    public ResponseEntity<List<HourlyAnalyticsResponse>> getAnalysisCompletions() {
        List<AnalyticsService.HourlyAnalytics> data = analyticsService.getAnalysisCompletions();
        List<HourlyAnalyticsResponse> response = data.stream()
            .map(item -> new HourlyAnalyticsResponse(item.getHour(), item.getCount()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
