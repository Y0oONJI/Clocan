package com.example.wardrobe.domain.auth.exception;

/**
 * 잘못된 인증 정보 예외
 * 
 * 로그인 시 이메일 또는 비밀번호가 일치하지 않을 때 발생하는 예외입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public class InvalidCredentialsException extends RuntimeException {

    /**
     * 생성자
     */
    public InvalidCredentialsException() {
        super("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}

