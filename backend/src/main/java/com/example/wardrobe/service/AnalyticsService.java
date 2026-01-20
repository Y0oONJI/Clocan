package com.example.wardrobe.service;

import com.example.wardrobe.common.logging.LogParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * 분석 서비스
 * 
 * 로그 파일을 읽어서 시간대별 집계를 수행합니다.
 * 로그 파일이 없거나 읽기 실패 시 더미 데이터를 반환합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Service
@Slf4j
public class AnalyticsService {
    
    @Value("${analytics.log.path:./logs/application.log}")
    private String logFilePath;
    
    @Value("${analytics.log.api.path:./logs/api-requests.log}")
    private String apiLogFilePath;
    
    /**
     * 시간대별 집계 데이터
     */
    public static class HourlyAnalytics {
        private int hour;      // 0-23
        private long count;    // 해당 시간대의 카운트
        
        public HourlyAnalytics(int hour, long count) {
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
     * 랜딩 페이지 접속 수 시간대별 집계
     * 
     * @return 시간대별(0-23) 접속 수 리스트
     */
    public List<HourlyAnalytics> getLandingPageViews() {
        try {
            List<String> logLines = readLogFiles();
            if (logLines.isEmpty()) {
                log.warn("No log files found, returning dummy data for landing page views");
                return generateDummyData("landing");
            }
            
            List<LogParser.ParsedLog> parsedLogs = logLines.stream()
                .map(LogParser::parse)
                .filter(Objects::nonNull)
                .filter(LogParser::isLandingPageAccess)
                .collect(Collectors.toList());
            
            return aggregateByHour(parsedLogs);
        } catch (Exception e) {
            log.error("Failed to get landing page views: {}", e.getMessage(), e);
            return generateDummyData("landing");
        }
    }
    
    /**
     * 스타일 퀴즈 완료 수 시간대별 집계
     * 
     * @return 시간대별(0-23) 완료 수 리스트
     */
    public List<HourlyAnalytics> getQuizCompletions() {
        try {
            List<String> logLines = readLogFiles();
            if (logLines.isEmpty()) {
                log.warn("No log files found, returning dummy data for quiz completions");
                return generateDummyData("quiz");
            }
            
            List<LogParser.ParsedLog> parsedLogs = logLines.stream()
                .map(LogParser::parse)
                .filter(Objects::nonNull)
                .filter(LogParser::isQuizComplete)
                .collect(Collectors.toList());
            
            return aggregateByHour(parsedLogs);
        } catch (Exception e) {
            log.error("Failed to get quiz completions: {}", e.getMessage(), e);
            return generateDummyData("quiz");
        }
    }
    
    /**
     * AI 분석 완료 수 시간대별 집계
     * 
     * @return 시간대별(0-23) 완료 수 리스트
     */
    public List<HourlyAnalytics> getAnalysisCompletions() {
        try {
            List<String> logLines = readLogFiles();
            if (logLines.isEmpty()) {
                log.warn("No log files found, returning dummy data for analysis completions");
                return generateDummyData("analysis");
            }
            
            List<LogParser.ParsedLog> parsedLogs = logLines.stream()
                .map(LogParser::parse)
                .filter(Objects::nonNull)
                .filter(LogParser::isAnalysisComplete)
                .collect(Collectors.toList());
            
            return aggregateByHour(parsedLogs);
        } catch (Exception e) {
            log.error("Failed to get analysis completions: {}", e.getMessage(), e);
            return generateDummyData("analysis");
        }
    }
    
    /**
     * 로그 파일 읽기
     * 
     * @return 로그 라인 리스트
     */
    private List<String> readLogFiles() {
        List<String> allLines = new ArrayList<>();
        
        // application.log 읽기 시도
        try {
            Path logPath = Paths.get(logFilePath);
            if (Files.exists(logPath)) {
                List<String> lines = Files.readAllLines(logPath);
                allLines.addAll(lines);
                log.debug("Read {} lines from {}", lines.size(), logFilePath);
            }
        } catch (IOException e) {
            log.warn("Failed to read log file {}: {}", logFilePath, e.getMessage());
        }
        
        // api-requests.log 읽기 시도
        try {
            Path apiLogPath = Paths.get(apiLogFilePath);
            if (Files.exists(apiLogPath)) {
                List<String> lines = Files.readAllLines(apiLogPath);
                allLines.addAll(lines);
                log.debug("Read {} lines from {}", lines.size(), apiLogFilePath);
            }
        } catch (IOException e) {
            log.warn("Failed to read API log file {}: {}", apiLogFilePath, e.getMessage());
        }
        
        return allLines;
    }
    
    /**
     * 시간대별로 집계
     * 
     * @param parsedLogs 파싱된 로그 리스트
     * @return 시간대별 집계 데이터 (0-23시)
     */
    private List<HourlyAnalytics> aggregateByHour(List<LogParser.ParsedLog> parsedLogs) {
        // 시간대별 카운트 맵 초기화 (0-23시)
        Map<Integer, Long> hourCountMap = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            hourCountMap.put(hour, 0L);
        }
        
        // 로그를 시간대별로 집계
        for (LogParser.ParsedLog log : parsedLogs) {
            if (log.getTimestamp() != null) {
                int hour = log.getTimestamp().getHour();
                hourCountMap.put(hour, hourCountMap.get(hour) + 1);
            }
        }
        
        // 시간대별 데이터 리스트 생성 (0시부터 23시까지 순서대로)
        return IntStream.range(0, 24)
            .mapToObj(hour -> new HourlyAnalytics(hour, hourCountMap.get(hour)))
            .collect(Collectors.toList());
    }
    
    /**
     * 더미 데이터 생성
     * 
     * @param type 데이터 타입 ("landing", "quiz", "analysis")
     * @return 시간대별 더미 데이터
     */
    private List<HourlyAnalytics> generateDummyData(String type) {
        Random random = new Random();
        List<HourlyAnalytics> dummyData = new ArrayList<>();
        
        // 타입별 기본 카운트 범위 설정
        int baseCount;
        int variance;
        
        switch (type) {
            case "landing":
                baseCount = 50;  // 랜딩 페이지는 더 많은 접속
                variance = 30;
                break;
            case "quiz":
                baseCount = 20;  // 퀴즈 완료는 중간
                variance = 15;
                break;
            case "analysis":
                baseCount = 15;  // 분석 완료는 상대적으로 적음
                variance = 10;
                break;
            default:
                baseCount = 20;
                variance = 15;
        }
        
        // 시간대별로 더미 데이터 생성
        // 오전 시간대(9-12시)와 오후 시간대(14-18시)에 더 많은 트래픽
        for (int hour = 0; hour < 24; hour++) {
            long count;
            
            if (hour >= 9 && hour <= 12) {
                // 오전 피크 시간대
                count = baseCount + random.nextInt(variance * 2) + 20;
            } else if (hour >= 14 && hour <= 18) {
                // 오후 피크 시간대
                count = baseCount + random.nextInt(variance * 2) + 25;
            } else if (hour >= 19 && hour <= 22) {
                // 저녁 시간대
                count = baseCount + random.nextInt(variance) + 10;
            } else if (hour >= 1 && hour <= 6) {
                // 새벽 시간대 (적은 트래픽)
                count = random.nextInt(5) + 1;
            } else {
                // 일반 시간대
                count = baseCount + random.nextInt(variance);
            }
            
            dummyData.add(new HourlyAnalytics(hour, count));
        }
        
        return dummyData;
    }
}
