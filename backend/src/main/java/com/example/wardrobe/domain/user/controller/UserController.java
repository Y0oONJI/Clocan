package com.example.wardrobe.domain.user.controller;

import com.example.wardrobe.domain.user.dto.SignupRequest;
import com.example.wardrobe.domain.user.dto.UpdateProfileRequest;
import com.example.wardrobe.domain.user.dto.UserProfileResponse;
import com.example.wardrobe.domain.user.entity.User;
import com.example.wardrobe.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 컨트롤러
 * 
 * 사용자 관련 API 엔드포인트를 제공합니다.
 * 회원가입, 프로필 조회, 프로필 수정 기능을 포함합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 회원가입
     * 
     * @param request 회원가입 요청 DTO
     * @return 생성된 사용자 프로필 응답
     */
    @PostMapping("/signup")
    public ResponseEntity<UserProfileResponse> signup(@Valid @RequestBody SignupRequest request) {
        User user = userService.signup(
                request.getEmail(),
                request.getPassword(),
                request.getNickname()
        );

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 현재 로그인한 사용자 프로필 조회
     * 
     * @return 현재 사용자 프로필 응답
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {
        // SecurityContext에서 현재 인증된 사용자 이메일 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // 이메일로 사용자 조회
        User user = userService.getUserByEmail(email);

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 프로필 조회
     * 
     * @param id 사용자 ID
     * @return 사용자 프로필 응답
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        User user = userService.getUserById(id);

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 프로필 수정
     * 
     * @param id 사용자 ID
     * @param request 프로필 수정 요청 DTO
     * @return 수정된 사용자 프로필 응답
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = userService.updateProfile(
                id,
                request.getNickname(),
                request.getProfileImageUrl()
        );

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }
}

