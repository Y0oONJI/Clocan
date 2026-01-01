package com.example.wardrobe.domain.user.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프로필 수정 요청 DTO
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    /**
     * 닉네임
     */
    @Size(max = 50, message = "닉네임은 50자 이하여야 합니다.")
    private String nickname;

    /**
     * 프로필 이미지 URL
     */
    @Size(max = 500, message = "프로필 이미지 URL은 500자 이하여야 합니다.")
    private String profileImageUrl;
}

