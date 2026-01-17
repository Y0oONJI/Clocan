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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

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
     * 공개 엔드포인트 (인증 불필요):
     * - /api/v1/auth/** - 인증 관련 (로그인, 회원가입 등)
     * - /api/v1/users/signup - 회원가입
     * - /api/v1/health/** - Health 체크 (배포 환경 모니터링용)
     * - /api/v1/feature1/** - Feature1 테스트 엔드포인트
     * - /api/v1/recommend/** - 추천 API (임시로 인증 불필요)
     * 
     * 그 외 모든 엔드포인트는 인증 필요
     * 
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception 설정 오류 시
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())) // H2 콘솔 사용을 위해
                .authorizeHttpRequests(auth -> auth
                        // 공개 엔드포인트 (인증 불필요) - 순서 중요: 구체적인 경로를 먼저
                        // 1. 인증 관련 (로그인, 회원가입)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/users/signup").permitAll()
                        
                        // 2. Health 체크 (배포 환경 모니터링용 - 클라우드타입 등에서 필요)
                        .requestMatchers("/api/v1/health", "/api/v1/health/**").permitAll()
                        
                        // 3. 공개 API (임시로 인증 불필요)
                        .requestMatchers("/api/v1/feature1/**").permitAll()
                        .requestMatchers("/api/v1/recommend/**").permitAll()
                        
                        // 4. Spring Boot 기본 경로 (에러 핸들러 등)
                        .requestMatchers("/error", "/error/**").permitAll()
                        
                        // 5. 개발 환경 전용 (H2 콘솔 - 프로덕션에서는 비활성화 권장)
                        .requestMatchers("/h2-console/**").permitAll()
                        
                        // TODO: 관리자 권한이 필요한 엔드포인트
                        // .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                );
        
        return http.build();
    }

    /**
     * CORS 설정
     * 
     * 프론트엔드에서 API를 호출할 수 있도록 CORS를 허용합니다.
     * 개발 환경에서는 모든 origin을 허용하지만, 프로덕션에서는 특정 origin만 허용해야 합니다.
     * 
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // 개발 환경: 모든 origin 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false); // 모든 origin 허용 시 false
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

