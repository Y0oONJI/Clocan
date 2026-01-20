package com.example.wardrobe.common.logging;

import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

/**
 * API 로깅 필터 (LoggingFilter)
 * 
 * 모든 HTTP 요청과 응답을 가로채서 로깅하는 필터
 * 
 * 주요 기능:
 * - HttpServletRequest의 Body를 ContentCachingRequestWrapper로 보존하여 로깅
 * - HttpServletResponse의 Body를 ContentCachingResponseWrapper로 보존하여 로깅
 * - 요청 헤더에서 X-Request-ID를 추출하거나 ULID를 생성하여 요청-응답 추적
 * - MDC(Mapped Diagnostic Context)를 사용하여 모든 로그에 requestId 포함
 * - 응답 헤더에 X-Request-ID 추가
 * - ULID는 시간 정보를 포함하므로 정렬에 유리함
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Component
@RequiredArgsConstructor
public class LoggingFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String MDC_REQUEST_ID_KEY = "requestId";

    private final ApiLogger apiLogger;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 요청 헤더에서 X-Request-ID 추출
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        
        // 없으면 서버에서 새로 ULID 생성
        // ULID는 시간 정보를 포함하므로 정렬에 유리함
        if (requestId == null || requestId.isEmpty()) {
            requestId = UlidCreator.getUlid().toString();
        }
        
        // MDC에 requestId 저장 (모든 로그에 자동 포함됨)
        MDC.put(MDC_REQUEST_ID_KEY, requestId);
        
        // 응답 헤더에 동일한 ID 추가
        response.setHeader(REQUEST_ID_HEADER, requestId);
        
        long startTime = System.currentTimeMillis();
        
        // 요청/응답 본문을 읽기 위해 래퍼 사용
        // HttpServletRequest의 Body는 한 번 읽으면 사라지므로,
        // ContentCachingRequestWrapper를 사용하여 내용을 보존합니다.
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
            
            // 요청 처리가 끝나면 반드시 MDC.clear()로 비워줌
            MDC.clear();
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
