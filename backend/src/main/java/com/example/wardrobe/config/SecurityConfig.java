package com.example.wardrobe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security 설정 클래스
 * 
 * 비밀번호 암호화를 위한 PasswordEncoder 빈을 등록합니다.
 * 현재는 개발 단계이므로 모든 요청을 허용하도록 설정되어 있습니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * PasswordEncoder 빈 등록
     * 
     * BCrypt 알고리즘을 사용하여 비밀번호를 암호화합니다.
     * 
     * @return BCryptPasswordEncoder 인스턴스
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * SecurityFilterChain 설정
     * 
     * 현재는 개발 단계이므로 모든 요청을 허용합니다.
     * 추후 인증/인가 로직 구현 시 수정이 필요합니다.
     * 
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception 설정 오류 시
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}

