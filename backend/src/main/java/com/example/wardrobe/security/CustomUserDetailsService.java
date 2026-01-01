package com.example.wardrobe.security;

import com.example.wardrobe.domain.user.entity.User;
import com.example.wardrobe.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserDetailsService 구현체
 * 
 * Spring Security가 사용자 인증 시 사용하는 서비스입니다.
 * 현재는 구조만 준비되어 있으며, JWT 구현 시 실제 인증 로직이 추가됩니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 이메일로 사용자를 조회하여 UserDetails를 반환합니다.
     * 
     * @param email 사용자 이메일
     * @return UserDetails
     * @throws UsernameNotFoundException 사용자를 찾을 수 없을 때
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        // TODO: JWT 구현 시 실제 UserDetails 반환 로직 추가
        // 현재는 구조만 준비되어 있음
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword() != null ? user.getPassword() : "")
                .authorities("ROLE_USER")
                .build();
    }
}

