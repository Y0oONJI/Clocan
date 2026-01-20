package com.example.wardrobe.common.logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * API 로거 유틸리티
 * 
 * 백엔드에서 프론트엔드로부터 받은 요청과 응답을 로깅하는 유틸리티 클래스
 * 
 * 별도 로거(LoggerFactory)를 사용하여 API 로그를 logs/api-requests.log 파일에 저장합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Component
public class ApiLogger {

    /**
     * API 전용 로거
     * logback-spring.xml에서 이 로거를 별도 파일(api-requests.log)에 저장하도록 설정됨
     */
    private static final Logger apiLogger = LoggerFactory.getLogger(ApiLogger.class);

    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    
    private final ObjectMapper objectMapper;
    
    @Value("${api.logging.enabled:true}")
    private boolean apiLoggingEnabled;
    
    @Value("${api.logging.log-request-body:true}")
    private boolean logRequestBody;
    
    @Value("${api.logging.log-response-body:true}")
    private boolean logResponseBody;

    public ApiLogger(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * API 요청 로깅
     * 
     * @param request HTTP 요청
     * @param requestId 요청 ID (추적용)
     */
    public void logRequest(HttpServletRequest request, String requestId) {
        if (!apiLoggingEnabled) {
            return;
        }

        try {
            Map<String, Object> logData = new LinkedHashMap<>();
            logData.put("type", "API_REQUEST");
            logData.put("requestId", requestId);
            logData.put("timestamp", LocalDateTime.now().format(TIMESTAMP_FORMATTER));
            logData.put("method", request.getMethod());
            logData.put("url", request.getRequestURI());
            logData.put("queryString", request.getQueryString());
            
            // 헤더 정보 (민감한 정보 제거)
            Map<String, String> headers = new LinkedHashMap<>();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                String headerValue = request.getHeader(headerName);
                
                // Authorization 헤더는 마스킹
                if ("authorization".equalsIgnoreCase(headerName)) {
                    headers.put(headerName, "[REDACTED]");
                } else {
                    headers.put(headerName, headerValue);
                }
            }
            logData.put("headers", headers);
            
            // 요청 본문 로깅 (설정에 따라)
            if (logRequestBody && request instanceof ContentCachingRequestWrapper) {
                ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length > 0) {
                    try {
                        String body = new String(content, StandardCharsets.UTF_8);
                        // JSON 파싱 시도
                        try {
                            Object jsonBody = objectMapper.readValue(body, Object.class);
                            logData.put("body", jsonBody);
                        } catch (Exception e) {
                            logData.put("body", body);
                        }
                    } catch (Exception e) {
                        logData.put("body", "[Failed to parse request body]");
                    }
                }
            }
            
            apiLogger.info("API Request: {}", formatLogData(logData));
        } catch (Exception e) {
            apiLogger.warn("Failed to log API request: {}", e.getMessage());
        }
    }

    /**
     * API 응답 로깅
     * 
     * @param request HTTP 요청
     * @param response HTTP 응답
     * @param requestId 요청 ID (추적용)
     * @param duration 처리 시간 (밀리초)
     */
    public void logResponse(HttpServletRequest request, HttpServletResponse response, String requestId, long duration) {
        if (!apiLoggingEnabled) {
            return;
        }

        try {
            Map<String, Object> logData = new LinkedHashMap<>();
            logData.put("type", "API_RESPONSE");
            logData.put("requestId", requestId);
            logData.put("timestamp", LocalDateTime.now().format(TIMESTAMP_FORMATTER));
            logData.put("method", request.getMethod());
            logData.put("url", request.getRequestURI());
            logData.put("status", response.getStatus());
            logData.put("duration", duration + "ms");
            
            // 응답 헤더 정보
            Map<String, String> headers = new LinkedHashMap<>();
            Collection<String> headerNames = response.getHeaderNames();
            for (String headerName : headerNames) {
                headers.put(headerName, response.getHeader(headerName));
            }
            logData.put("headers", headers);
            
            // 응답 본문 로깅 (설정에 따라)
            if (logResponseBody && response instanceof ContentCachingResponseWrapper) {
                ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length > 0) {
                    try {
                        String body = new String(content, StandardCharsets.UTF_8);
                        // JSON 파싱 시도
                        try {
                            Object jsonBody = objectMapper.readValue(body, Object.class);
                            logData.put("body", jsonBody);
                        } catch (Exception e) {
                            logData.put("body", body);
                        }
                    } catch (Exception e) {
                        logData.put("body", "[Failed to parse response body]");
                    }
                }
            }
            
            // 에러 상태 코드인 경우 error 레벨로 로깅
            if (response.getStatus() >= 400) {
                apiLogger.error("API Response Error: {}", formatLogData(logData));
            } else {
                apiLogger.info("API Response: {}", formatLogData(logData));
            }
        } catch (Exception e) {
            apiLogger.warn("Failed to log API response: {}", e.getMessage());
        }
    }

    /**
     * API 에러 로깅
     * 
     * @param request HTTP 요청
     * @param error 에러 객체
     * @param requestId 요청 ID (추적용)
     * @param duration 처리 시간 (밀리초)
     */
    public void logError(HttpServletRequest request, Exception error, String requestId, long duration) {
        if (!apiLoggingEnabled) {
            return;
        }

        try {
            Map<String, Object> logData = new LinkedHashMap<>();
            logData.put("type", "API_ERROR");
            logData.put("requestId", requestId);
            logData.put("timestamp", LocalDateTime.now().format(TIMESTAMP_FORMATTER));
            logData.put("method", request.getMethod());
            logData.put("url", request.getRequestURI());
            logData.put("duration", duration + "ms");
            logData.put("error", Map.of(
                "name", error.getClass().getSimpleName(),
                "message", error.getMessage() != null ? error.getMessage() : "Unknown error",
                "stackTrace", getStackTrace(error)
            ));
            
            apiLogger.error("API Error: {}", formatLogData(logData));
        } catch (Exception e) {
            apiLogger.warn("Failed to log API error: {}", e.getMessage());
        }
    }

    /**
     * 로그 데이터를 포맷팅
     */
    private String formatLogData(Map<String, Object> logData) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(logData);
        } catch (Exception e) {
            return logData.toString();
        }
    }

    /**
     * 스택 트레이스 추출 (최대 10줄)
     */
    private List<String> getStackTrace(Exception error) {
        List<String> stackTrace = new ArrayList<>();
        StackTraceElement[] elements = error.getStackTrace();
        int maxLines = Math.min(10, elements.length);
        for (int i = 0; i < maxLines; i++) {
            stackTrace.add(elements[i].toString());
        }
        return stackTrace;
    }
}
