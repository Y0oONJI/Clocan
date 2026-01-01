package com.example.wardrobe.domain.user.entity;

/**
 * 인증 제공자 Enum
 * 
 * 사용자가 어떤 방식으로 회원가입/로그인을 했는지 구분합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public enum AuthProvider {
    /**
     * 로컬 회원가입 (이메일/비밀번호)
     */
    LOCAL,
    
    /**
     * Google OAuth2 소셜 로그인
     */
    GOOGLE
}

