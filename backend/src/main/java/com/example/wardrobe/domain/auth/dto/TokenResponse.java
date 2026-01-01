package com.example.wardrobe.domain.auth.dto;

/**
 * 토큰 응답 DTO
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public record TokenResponse(
        /**
         * Access Token (JWT)
         */
        String accessToken,
        
        /**
         * 토큰 타입 (Bearer)
         */
        String tokenType
) {
    public TokenResponse(String accessToken) {
        this(accessToken, "Bearer");
    }
}

