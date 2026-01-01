package com.example.wardrobe.domain.user.repository;

import com.example.wardrobe.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 사용자 Repository 인터페이스
 * 
 * User 엔티티에 대한 데이터 접근 계층입니다.
 * Spring Data JPA의 메서드 네이밍 컨벤션을 사용하여 쿼리를 자동 생성합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 존재 여부 확인
     * 
     * 회원가입 시 이메일 중복 체크에 사용됩니다.
     * 
     * @param email 확인할 이메일 주소
     * @return 이메일이 존재하면 true, 없으면 false
     */
    boolean existsByEmail(String email);

    /**
     * 이메일로 사용자 조회
     * 
     * 로그인 시 이메일로 사용자를 찾을 때 사용됩니다.
     * 
     * @param email 조회할 이메일 주소
     * @return 사용자가 존재하면 Optional<User>, 없으면 Optional.empty()
     */
    Optional<User> findByEmail(String email);
}

