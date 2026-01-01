package com.example.wardrobe.domain.auth.service;

import com.example.wardrobe.domain.auth.dto.LoginRequest;
import com.example.wardrobe.domain.auth.dto.TokenResponse;
import com.example.wardrobe.domain.auth.exception.InvalidCredentialsException;
import com.example.wardrobe.domain.user.entity.User;
import com.example.wardrobe.domain.user.repository.UserRepository;
import com.example.wardrobe.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스
 * 
 * 로그인 및 JWT 토큰 발급을 담당합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 로그인 및 JWT 토큰 발급
     * 
     * 이메일과 비밀번호를 검증하고, 성공 시 JWT 토큰을 발급합니다.
     * 
     * @param request 로그인 요청 DTO
     * @return 토큰 응답 DTO
     * @throws InvalidCredentialsException 이메일 또는 비밀번호가 올바르지 않을 때
     */
    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        // 비밀번호 검증
        if (user.getPassword() == null || 
            !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateToken(user.getEmail());

        return new TokenResponse(accessToken);
    }
}

