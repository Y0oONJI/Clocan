package com.example.wardrobe.common.logging;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 로그 파서 클래스
 * 
 * 정규표현식을 사용하여 로그 한 줄을 파싱하여 구조화된 데이터를 추출합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public class LogParser {
    
    /**
     * 백엔드 로그 패턴
     * 
     * 예시: "2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3"
     * 
     * 참고: 실제 로그는 Spring Boot 기본 Logback 로거를 사용하며, 컨트롤러나 서비스 클래스에서 직접 로깅합니다.
     */
    private static final Pattern BACKEND_LOG_PATTERN = Pattern.compile(
        "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}) " +  // Group 1: timestamp
        "(INFO|DEBUG|ERROR|WARN) " +                                 // Group 2: level
        "\\[([A-Z0-9]{26})\\] " +                                    // Group 3: requestId (ULID 26자)
        ".*?API Request: (GET|POST|PUT|DELETE|PATCH) " +            // Group 4: method
        "([^|\\s]+)" +                                                // Group 5: apiPath
        ".*?RequestId: ([A-Z0-9]{26})"                                // Group 6: requestId 확인
    );
    
    /**
     * 프론트엔드 로그 패턴 (백엔드로 전송된 경우)
     * 
     * 예시: "[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START { \"requestId\": \"550e8400-...\", \"url\": \"https://...\" }"
     */
    private static final Pattern FRONTEND_LOG_PATTERN = Pattern.compile(
        "\\[([^]]+)\\]" +                                             // Group 1: timestamp
        "\\[FE\\]" +
        "\\[([^]]+)\\]" +                                             // Group 2: level
        "\\[([^]]+)\\]" +                                             // Group 3: scope
        " ([A-Z_]+)" +                                                // Group 4: event
        ".*?\"requestId\"[:\"\\s]+([A-Za-z0-9-]+)" +                 // Group 5: requestId
        ".*?\"url\"[:\"\\s]+([^\\s}]+)"                              // Group 6: url
    );
    
    /**
     * 페이지뷰 이벤트 패턴 (프론트엔드)
     * 
     * 예시: "page_view" 이벤트에서 페이지 경로 추출
     */
    private static final Pattern PAGE_VIEW_PATTERN = Pattern.compile(
        "page_view.*?page_path[:\"\\s]+([^\\s}]+)"
    );
    
    
    private static final DateTimeFormatter BACKEND_TIMESTAMP_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    
    private static final DateTimeFormatter FRONTEND_TIMESTAMP_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    /**
     * 파싱된 로그 데이터를 담는 클래스
     */
    public static class ParsedLog {
        private String requestId;
        private LocalDateTime timestamp;
        private String method;
        private String apiPath;
        private String referer;
        private String logType; // "backend" | "frontend"
        private String event;   // "page_view", "quiz_complete", "result_generated" 등
        
        public ParsedLog() {
        }
        
        public ParsedLog(String requestId, LocalDateTime timestamp, String method, 
                        String apiPath, String referer, String logType, String event) {
            this.requestId = requestId;
            this.timestamp = timestamp;
            this.method = method;
            this.apiPath = apiPath;
            this.referer = referer;
            this.logType = logType;
            this.event = event;
        }
        
        // Getters and Setters
        public String getRequestId() {
            return requestId;
        }
        
        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }
        
        public LocalDateTime getTimestamp() {
            return timestamp;
        }
        
        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }
        
        public String getMethod() {
            return method;
        }
        
        public void setMethod(String method) {
            this.method = method;
        }
        
        public String getApiPath() {
            return apiPath;
        }
        
        public void setApiPath(String apiPath) {
            this.apiPath = apiPath;
        }
        
        public String getReferer() {
            return referer;
        }
        
        public void setReferer(String referer) {
            this.referer = referer;
        }
        
        public String getLogType() {
            return logType;
        }
        
        public void setLogType(String logType) {
            this.logType = logType;
        }
        
        public String getEvent() {
            return event;
        }
        
        public void setEvent(String event) {
            this.event = event;
        }
    }
    
    /**
     * 로그 한 줄을 파싱
     * 
     * @param logLine 로그 한 줄
     * @return ParsedLog 객체 (파싱 실패 시 null)
     */
    public static ParsedLog parse(String logLine) {
        if (logLine == null || logLine.trim().isEmpty()) {
            return null;
        }
        
        // 백엔드 로그 패턴 매칭 시도
        Matcher backendMatcher = BACKEND_LOG_PATTERN.matcher(logLine);
        if (backendMatcher.matches()) {
            return parseBackendLog(backendMatcher, logLine);
        }
        
        // 프론트엔드 로그 패턴 매칭 시도
        Matcher frontendMatcher = FRONTEND_LOG_PATTERN.matcher(logLine);
        if (frontendMatcher.find()) {
            return parseFrontendLog(frontendMatcher, logLine);
        }
        
        return null; // 파싱 실패
    }
    
    /**
     * 백엔드 로그 파싱
     */
    private static ParsedLog parseBackendLog(Matcher matcher, String logLine) {
        try {
            String timestampStr = matcher.group(1);
            String requestId = matcher.group(3);
            String method = matcher.group(4);
            String apiPath = matcher.group(5);
            
            LocalDateTime timestamp = LocalDateTime.parse(timestampStr, BACKEND_TIMESTAMP_FORMATTER);
            
            // 이벤트 타입 추출
            String event = extractEventFromBackendLog(logLine, apiPath);
            
            return new ParsedLog(
                requestId,
                timestamp,
                method,
                apiPath,
                null, // 백엔드 로그에는 referer 없음
                "backend",
                event
            );
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * 프론트엔드 로그 파싱
     */
    private static ParsedLog parseFrontendLog(Matcher matcher, String logLine) {
        try {
            String timestampStr = matcher.group(1);
            String event = matcher.group(4);
            String requestId = matcher.group(5);
            String url = matcher.group(6);
            
            LocalDateTime timestamp;
            try {
                timestamp = LocalDateTime.parse(timestampStr, FRONTEND_TIMESTAMP_FORMATTER);
            } catch (Exception e) {
                // 다른 형식 시도
                timestamp = LocalDateTime.now();
            }
            
            // URL에서 API 경로 추출
            String apiPath = extractApiPathFromUrl(url);
            
            // 페이지 경로 추출 (page_view 이벤트인 경우)
            String referer = null;
            if ("page_view".equals(event)) {
                Matcher pageViewMatcher = PAGE_VIEW_PATTERN.matcher(logLine);
                if (pageViewMatcher.find()) {
                    referer = pageViewMatcher.group(1);
                }
            }
            
            return new ParsedLog(
                requestId,
                timestamp,
                "GET", // 프론트엔드 로그는 기본적으로 GET
                apiPath,
                referer,
                "frontend",
                event
            );
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * 백엔드 로그에서 이벤트 타입 추출
     */
    private static String extractEventFromBackendLog(String logLine, String apiPath) {
        // API 경로 기반으로 이벤트 추정
        if (apiPath.equals("/") || apiPath.startsWith("/api/v1/")) {
            // 랜딩 페이지 관련 API
            if (apiPath.equals("/") || apiPath.contains("landing")) {
                return "page_view";
            }
            // 퀴즈 관련 API
            if (apiPath.contains("quiz") || apiPath.contains("style-quiz")) {
                if (apiPath.contains("complete") || apiPath.contains("result")) {
                    return "quiz_complete";
                }
            }
            // 분석 관련 API
            if (apiPath.contains("result") || apiPath.contains("analysis")) {
                return "result_generated";
            }
        }
        return "api_request";
    }
    
    /**
     * URL에서 API 경로 추출
     */
    private static String extractApiPathFromUrl(String url) {
        if (url == null) {
            return "/";
        }
        
        try {
            // URL에서 경로 부분만 추출
            int pathStart = url.indexOf("/", url.indexOf("://") + 3);
            if (pathStart == -1) {
                return "/";
            }
            
            int queryStart = url.indexOf("?", pathStart);
            if (queryStart == -1) {
                return url.substring(pathStart);
            }
            
            return url.substring(pathStart, queryStart);
        } catch (Exception e) {
            return "/";
        }
    }
    
    /**
     * 랜딩 페이지 접속 로그인지 확인
     */
    public static boolean isLandingPageAccess(ParsedLog log) {
        if (log == null) {
            return false;
        }
        
        // 프론트엔드 로그: page_view 이벤트이고 경로가 "/"
        if ("frontend".equals(log.getLogType()) && "page_view".equals(log.getEvent())) {
            return "/".equals(log.getApiPath()) || "/".equals(log.getReferer());
        }
        
        // 백엔드 로그: API 경로가 "/" 또는 랜딩 페이지 관련
        if ("backend".equals(log.getLogType())) {
            return "/".equals(log.getApiPath()) || log.getApiPath().contains("landing");
        }
        
        return false;
    }
    
    /**
     * 퀴즈 완료 로그인지 확인
     */
    public static boolean isQuizComplete(ParsedLog log) {
        if (log == null) {
            return false;
        }
        
        // 프론트엔드 로그: quiz_complete 이벤트
        if ("frontend".equals(log.getLogType()) && "quiz_complete".equals(log.getEvent())) {
            return true;
        }
        
        // 백엔드 로그: API 경로에 quiz/complete 포함
        if ("backend".equals(log.getLogType())) {
            return log.getApiPath().contains("quiz") && 
                   (log.getApiPath().contains("complete") || log.getApiPath().contains("result"));
        }
        
        return false;
    }
    
    /**
     * AI 분석 완료 로그인지 확인
     */
    public static boolean isAnalysisComplete(ParsedLog log) {
        if (log == null) {
            return false;
        }
        
        // 프론트엔드 로그: result_generated 이벤트
        if ("frontend".equals(log.getLogType()) && "result_generated".equals(log.getEvent())) {
            return true;
        }
        
        // 백엔드 로그: API 경로에 result/analysis 포함
        if ("backend".equals(log.getLogType())) {
            return log.getApiPath().contains("result") || log.getApiPath().contains("analysis");
        }
        
        return false;
    }
}
