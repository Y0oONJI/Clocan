package com.example.wardrobe.config;

import com.example.wardrobe.security.CustomAccessDeniedHandler;
import com.example.wardrobe.security.CustomAuthenticationEntryPoint;
import com.example.wardrobe.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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
     * WebSecurityCustomizer: Security 필터 체인을 완전히 우회할 경로 지정
     * Swagger 관련 경로는 Security 필터 체인 자체에서 제외
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/swagger-ui/index.html")
                .requestMatchers("/v3/api-docs/**", "/v3/api-docs.yaml", "/v3/api-docs.yml")
                .requestMatchers("/swagger-resources/**", "/swagger-resources")
                .requestMatchers("/webjars/**");
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())) // H2 콘솔 사용을 위해
                .authorizeHttpRequests(auth -> auth
                        // 공개 엔드포인트 (인증 불필요) - 순서 중요: 구체적인 경로를 먼저
                        // 0. Swagger UI 및 API 문서 (최우선 - 개발 환경)
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/swagger-ui/index.html", "/swagger-ui/**/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/v3/api-docs.yaml", "/v3/api-docs.yml").permitAll()
                        .requestMatchers("/swagger-resources/**", "/swagger-resources", "/swagger-resources/**/**").permitAll()
                        .requestMatchers("/webjars/**", "/webjars/**/**").permitAll()
                        
                        // 1. Health 체크 (배포 환경 모니터링용 - 클라우드타입 등에서 필요)
                        .requestMatchers("/api/v1/health", "/api/v1/health/**").permitAll()
                        .requestMatchers("/", "/health", "/healthz").permitAll() // Cloud Type 기본 헬스체크 경로
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/**").permitAll() // Spring Boot Actuator 헬스체크
                        
                        // 2. 인증 관련 (로그인, 회원가입)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/users/signup").permitAll()
                        
                        // 4. 공개 API (임시로 인증 불필요)
                        .requestMatchers("/api/v1/feature1/**").permitAll()
                        .requestMatchers("/api/v1/recommend/**").permitAll()
                        
                        // 5. 어드민 분석 API (인증 불필요 - 공개 통계 데이터)
                        .requestMatchers("/api/v1/admin/analytics/**").permitAll()
                        
                        // 6. Spring Boot 기본 경로 (에러 핸들러 등)
                        .requestMatchers("/error", "/error/**").permitAll()
                        
                        // 6. 개발 환경 전용 (H2 콘솔 - 프로덕션에서는 비활성화 권장)
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
     * 프로덕션 환경에서는 특정 origin만 허용합니다.
     * 
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 프론트엔드 도메인 목록
        configuration.setAllowedOrigins(List.of(
                "http://localhost:9002",           // 로컬 개발 환경
                "http://localhost:3000",           // Next.js 기본 포트
                "https://hclocan.vercel.app",      // Vercel 배포 도메인
                "https://www.hclocan.vercel.app"   // Vercel www 서브도메인 (필요시)
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // 특정 origin 허용 시 true로 변경 가능
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

