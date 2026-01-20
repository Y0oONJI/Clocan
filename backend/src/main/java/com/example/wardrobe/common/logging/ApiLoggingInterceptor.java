package com.example.wardrobe.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.UUID;

/**
 * API 로깅 인터셉터
 * 
 * 모든 HTTP 요청과 응답을 가로채서 로깅하는 필터
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Component
@RequiredArgsConstructor
public class ApiLoggingInterceptor extends OncePerRequestFilter {

    private final ApiLogger apiLogger;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 요청 ID 생성 (요청 추적용)
        String requestId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        // 요청/응답 본문을 읽기 위해 래퍼 사용
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
        
        try {
            // 요청 로깅
            apiLogger.logRequest(requestWrapper, requestId);
            
            // 필터 체인 실행
            filterChain.doFilter(requestWrapper, responseWrapper);
            
            // 응답 로깅
            long duration = System.currentTimeMillis() - startTime;
            apiLogger.logResponse(requestWrapper, responseWrapper, requestId, duration);
            
        } catch (Exception e) {
            // 에러 로깅
            long duration = System.currentTimeMillis() - startTime;
            apiLogger.logError(requestWrapper, (Exception) e, requestId, duration);
            throw e;
        } finally {
            // 응답 본문을 클라이언트로 전송
            responseWrapper.copyBodyToResponse();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 정적 리소스나 특정 경로는 필터링 제외
        String path = request.getRequestURI();
        return path.startsWith("/h2-console") 
            || path.startsWith("/swagger-ui")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/actuator");
    }
}
