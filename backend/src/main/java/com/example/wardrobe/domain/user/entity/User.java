package com.example.wardrobe.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔티티
 * 
 * 회원 정보를 관리하는 엔티티입니다.
 * 이메일/비밀번호 기반 로컬 회원가입과 소셜 로그인(Google)을 지원합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    /**
     * 사용자 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 이메일 주소
     * 유니크 제약조건이 있으며, 필수 입력입니다.
     */
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    /**
     * 비밀번호 (암호화된 값)
     * 로컬 회원가입 시 필수이며, 소셜 로그인 사용자는 null일 수 있습니다.
     */
    @Column(nullable = true, length = 255)
    private String password;

    /**
     * 닉네임
     * 사용자 프로필에 표시되는 이름입니다.
     */
    @Column(length = 50)
    private String nickname;

    /**
     * 프로필 이미지 URL
     * 사용자 프로필 사진의 저장 경로입니다.
     */
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    /**
     * 인증 제공자
     * 로컬 회원가입(LOCAL) 또는 소셜 로그인(GOOGLE)을 구분합니다.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider provider;

    /**
     * User 엔티티 생성자
     * 
     * @param email 이메일 주소
     * @param password 비밀번호 (암호화된 값)
     * @param nickname 닉네임
     * @param profileImageUrl 프로필 이미지 URL
     * @param provider 인증 제공자
     */
    @Builder
    public User(String email, String password, String nickname, String profileImageUrl, AuthProvider provider) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.provider = provider;
    }

    /**
     * 닉네임 변경
     * 
     * @param nickname 새로운 닉네임
     */
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    /**
     * 프로필 이미지 변경
     * 
     * @param profileImageUrl 새로운 프로필 이미지 URL
     */
    public void updateProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    /**
     * 비밀번호 변경
     * 
     * @param encryptedPassword 암호화된 새 비밀번호
     */
    public void updatePassword(String encryptedPassword) {
        this.password = encryptedPassword;
    }
}

