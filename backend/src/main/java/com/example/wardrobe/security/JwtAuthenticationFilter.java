package com.example.wardrobe.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 인증 필터
 * 
 * 요청 헤더에서 Bearer 토큰을 추출하고 검증하여 SecurityContext에 인증 정보를 설정합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    /**
     * OncePerRequestFilter의 shouldNotFilter 오버라이드
     * permitAll 경로는 필터를 건너뛰도록 설정
     * 
     * @param request HttpServletRequest
     * @return 필터를 건너뛰어야 하면 true
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        boolean shouldSkip = shouldSkipFilter(requestURI);
        // INFO 레벨로 로그 찍기 (확인용)
        if (shouldSkip) {
            log.info("⏭️ [JWT 필터] 경로 {} 는 인증을 건너뜁니다. (shouldNotFilter=true)", requestURI);
        } else {
            log.info("🔒 [JWT 필터] 경로 {} 는 인증이 필요합니다. (shouldNotFilter=false)", requestURI);
        }
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // 요청 헤더에서 토큰 추출
        String token = resolveToken(request);

        // 토큰이 있는 경우에만 인증 처리
        if (token != null && StringUtils.hasText(token)) {
            log.debug("🔑 [JWT 필터] 토큰 추출 성공 (토큰 길이: {}자)", token.length());

            // 토큰이 있고 유효한 경우
            if (jwtTokenProvider.validateToken(token)) {
                log.debug("✅ [JWT 필터] 토큰 검증 성공");

                try {
                    // 토큰에서 이메일 추출
                    String email = jwtTokenProvider.getEmailFromToken(token);
                    log.debug("✅ [JWT 필터] 이메일 추출 성공: {}", email);

                    // UserDetails 조회
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    log.debug("✅ [JWT 필터] 사용자 정보 조회 성공: {}", userDetails.getUsername());

                    // 인증 객체 생성
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // 요청 정보 설정
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // SecurityContext에 인증 정보 설정
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("✅ [JWT 필터] SecurityContext에 인증 정보 저장 완료");
                } catch (Exception e) {
                    log.error("❌ [JWT 필터] 인증 처리 중 오류 발생: {}", e.getMessage());
                    // 인증 실패 시 SecurityContext는 그대로 두고 다음 필터로 진행
                    // SecurityConfig의 authenticationEntryPoint가 401을 반환할 것임
                }
            } else {
                log.debug("⚠️ [JWT 필터] 토큰 검증 실패 - 유효하지 않은 토큰입니다.");
                // 유효하지 않은 토큰이어도 필터는 통과시키고, SecurityConfig가 처리하도록 함
            }
        } else {
            log.debug("⏭️ [JWT 필터] 토큰이 없습니다. 인증이 필요한 경로라면 SecurityConfig에서 401을 반환합니다.");
            // 토큰이 없으면 SecurityContext에 인증 정보를 설정하지 않고 다음 필터로 진행
            // SecurityConfig의 authenticationEntryPoint가 인증이 필요한 경로에서 401을 반환
        }

        // 다음 필터로 진행 (SecurityConfig의 인증 정책에 따라 처리됨)
        filterChain.doFilter(request, response);
    }

    /**
     * SecurityConfig의 permitAll 경로와 정확히 동기화
     * 필터를 건너뛰어야 하는 공개 엔드포인트 목록
     */
    private boolean shouldSkipFilter(String requestURI) {


        // 0. Swagger UI 및 API 문서 (최우선 - 개발 환경)
        // 더 포괄적인 매칭을 위해 contains와 startsWith 모두 사용
        if (requestURI.startsWith("/swagger-ui") 
                || requestURI.contains("/swagger-ui") 
                || requestURI.equals("/swagger-ui.html")
                || requestURI.equals("/swagger-ui/index.html")) {
            log.info("⏭️ [JWT 필터] Swagger UI 경로 감지 및 제외: {}", requestURI);
            return true;
        }
        if (requestURI.startsWith("/v3/api-docs") 
                || requestURI.contains("/v3/api-docs") 
                || requestURI.equals("/v3/api-docs.yaml") 
                || requestURI.equals("/v3/api-docs.yml")) {
            log.info("⏭️ [JWT 필터] API Docs 경로 감지 및 제외: {}", requestURI);
            return true;
        }
        if (requestURI.startsWith("/swagger-resources") || requestURI.contains("/swagger-resources")) {
            log.info("⏭️ [JWT 필터] Swagger Resources 경로 감지 및 제외: {}", requestURI);
            return true;
        }
        if (requestURI.startsWith("/webjars") || requestURI.contains("/webjars")) {
            log.info("⏭️ [JWT 필터] Webjars 경로 감지 및 제외: {}", requestURI);
            return true;
        }
        
        // 1. Health 체크 (배포 환경 모니터링용)
        if (requestURI.equals("/api/v1/health") || requestURI.startsWith("/api/v1/health/")) {
            return true;
        }
        if (requestURI.equals("/") || requestURI.equals("/health") || requestURI.equals("/healthz")) {
            return true;
        }
        if (requestURI.startsWith("/actuator/")) {
            return true;
        }
        
        // 2. 인증 관련 경로
        if (requestURI.startsWith("/api/v1/auth/")) {
            return true;
        }
        if (requestURI.equals("/api/v1/users/signup")) {
            return true;
        }
        
        // 4. 공개 API
        if (requestURI.startsWith("/api/v1/feature1/") || requestURI.startsWith("/api/v1/recommend/")) {
            return true;
        }
        
        // 4. Spring Boot 에러 핸들러 경로
        // 주의: /error 경로를 permitAll에 두는 것은 일반적인 해결책이지만,
        // 실제 에러가 발생하지 않도록 설정을 올바르게 해야 함
        if (requestURI.equals("/error") || requestURI.startsWith("/error/")) {
            return true;
        }
        
        // 5. 개발 환경 전용 (H2 콘솔)
        if (requestURI.startsWith("/h2-console/")) {
            return true;
        }
        
        return false;
    }

    /**
     * 요청 헤더에서 Bearer 토큰을 추출합니다.
     * 
     * @param request HttpServletRequest
     * @return 추출된 토큰 (없으면 null)
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            String token = bearerToken.substring(BEARER_PREFIX.length());
            log.debug("🔑 [JWT 필터] Authorization 헤더에서 토큰 추출: {}...", 
                    token.length() > 20 ? token.substring(0, 20) + "..." : token);
            return token;
        }
        log.debug("🔑 [JWT 필터] Authorization 헤더가 없거나 Bearer 형식이 아닙니다.");
        return null;
    }

}

