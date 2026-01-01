package com.example.wardrobe.domain.user.exception;

/**
 * 이메일 중복 예외
 * 
 * 회원가입 시 이미 존재하는 이메일로 가입을 시도할 때 발생하는 예외입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public class EmailAlreadyExistsException extends RuntimeException {

    /**
     * 생성자
     * 
     * @param email 중복된 이메일 주소
     */
    public EmailAlreadyExistsException(String email) {
        super("이미 사용 중인 이메일입니다: " + email);
    }
}

