package com.example.wardrobe.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 DTO
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    /**
     * 이메일 주소
     */
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    /**
     * 비밀번호
     */
    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다.")
    private String password;

    /**
     * 닉네임
     */
    @Size(max = 50, message = "닉네임은 50자 이하여야 합니다.")
    private String nickname;
}

