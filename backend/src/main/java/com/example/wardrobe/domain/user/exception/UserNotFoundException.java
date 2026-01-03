package com.example.wardrobe.domain.user.exception;

/**
 * 사용자를 찾을 수 없는 예외
 * 
 * 존재하지 않는 사용자 ID로 조회하거나 수정을 시도할 때 발생하는 예외입니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * 생성자
     * 
     * @param userId 찾을 수 없는 사용자 ID
     */
    public UserNotFoundException(Long userId) {
        super("사용자를 찾을 수 없습니다. ID: " + userId);
    }

    /**
     * 생성자
     * 
     * @param message 에러 메시지
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}

