package com.example.wardrobe.domain.user.service;

import com.example.wardrobe.domain.user.entity.AuthProvider;
import com.example.wardrobe.domain.user.entity.User;
import com.example.wardrobe.domain.user.exception.EmailAlreadyExistsException;
import com.example.wardrobe.domain.user.exception.UserNotFoundException;
import com.example.wardrobe.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 서비스 클래스
 * 
 * 사용자 관련 비즈니스 로직을 처리합니다.
 * 회원가입, 로그인, 프로필 관리 등의 기능을 제공합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     * 
     * 이메일 중복 체크 후 비밀번호를 암호화하여 사용자를 저장합니다.
     * 
     * @param email 이메일 주소
     * @param password 비밀번호 (평문)
     * @param nickname 닉네임 (선택)
     * @return 저장된 User 엔티티
     * @throws EmailAlreadyExistsException 이미 존재하는 이메일인 경우
     */
    @Transactional
    public User signup(String email, String password, String nickname) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(password);

        // User 엔티티 생성 및 저장
        User user = User.builder()
                .email(email)
                .password(encryptedPassword)
                .nickname(nickname)
                .provider(AuthProvider.LOCAL)
                .build();

        return userRepository.save(user);
    }

    /**
     * 사용자 프로필 조회
     * 
     * @param userId 사용자 ID
     * @return User 엔티티
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    /**
     * 이메일로 사용자 조회
     * 
     * @param email 사용자 이메일
     * @return User 엔티티
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("이메일: " + email));
    }

    /**
     * 프로필 수정
     * 
     * @param userId 사용자 ID
     * @param nickname 새로운 닉네임 (null이면 변경하지 않음)
     * @param profileImageUrl 새로운 프로필 이미지 URL (null이면 변경하지 않음)
     * @return 수정된 User 엔티티
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    @Transactional
    public User updateProfile(Long userId, String nickname, String profileImageUrl) {
        User user = getUserById(userId);

        if (nickname != null && !nickname.isBlank()) {
            user.updateNickname(nickname);
        }

        if (profileImageUrl != null && !profileImageUrl.isBlank()) {
            user.updateProfileImageUrl(profileImageUrl);
        }

        return user;
    }
}

