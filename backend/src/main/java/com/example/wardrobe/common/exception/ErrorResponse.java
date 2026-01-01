package com.example.wardrobe.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 에러 응답 DTO
 * 
 * GlobalExceptionHandler에서 사용하는 공통 에러 응답 형식입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@AllArgsConstructor
public class ErrorResponse {

    /**
     * 에러 발생 시간
     */
    private LocalDateTime timestamp;

    /**
     * HTTP 상태 코드
     */
    private int status;

    /**
     * 에러 메시지
     */
    private String message;

    /**
     * 에러 경로
     */
    private String path;

    /**
     * ErrorResponse 생성
     * 
     * @param status HTTP 상태 코드
     * @param message 에러 메시지
     * @param path 에러 발생 경로
     * @return ErrorResponse 인스턴스
     */
    public static ErrorResponse of(int status, String message, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, message, path);
    }
}

