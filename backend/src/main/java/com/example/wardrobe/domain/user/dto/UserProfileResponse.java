package com.example.wardrobe.domain.user.dto;

import java.time.LocalDateTime;

/**
 * 사용자 프로필 응답 DTO
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public record UserProfileResponse(
        Long id,
        String email,
        String nickname,
        String profileImageUrl,
        LocalDateTime createdAt
) {
}

