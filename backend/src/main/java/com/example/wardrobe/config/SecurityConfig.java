package com.example.wardrobe.config;

import com.example.wardrobe.security.CustomAccessDeniedHandler;
import com.example.wardrobe.security.CustomAuthenticationEntryPoint;
import com.example.wardrobe.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security 설정 클래스
 * 
 * Spring Security 기본 설정을 관리합니다.
 * - 회원가입(/api/v1/users/signup)은 인증 없이 접근 가능
 * - 그 외 API는 인증 필요
 * - 비밀번호 암호화는 BCryptPasswordEncoder 사용
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomAuthenticationEntryPoint authenticationEntryPoint,
            CustomAccessDeniedHandler accessDeniedHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

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
     * - /api/v1/auth/** 엔드포인트는 인증 없이 접근 가능 (회원가입, 로그인 등)
     * - 그 외 모든 API는 인증 필요
     * - JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
     * - CSRF는 비활성화 (REST API이므로)
     * - 인증/인가 실패 시 커스텀 핸들러 사용
     * 
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception 설정 오류 시
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/users/signup").permitAll()
                        // TODO: 관리자 권한이 필요한 엔드포인트 예시
                        // .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                );
        
        return http.build();
    }
}

