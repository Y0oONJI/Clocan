package com.example.wardrobe.domain.auth.controller;

import com.example.wardrobe.domain.auth.dto.LoginRequest;
import com.example.wardrobe.domain.auth.dto.TokenResponse;
import com.example.wardrobe.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 컨트롤러
 * 
 * 로그인 및 인증 관련 API 엔드포인트를 제공합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@RestController
@RequestMapping(value = "/api/v1/auth", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 로그인
     * 
     * 이메일과 비밀번호를 검증하고, 성공 시 JWT 토큰을 발급합니다.
     * 
     * @param request 로그인 요청 DTO
     * @return 토큰 응답 (Access Token 포함)
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

