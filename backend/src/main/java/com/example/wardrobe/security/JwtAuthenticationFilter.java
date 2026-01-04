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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("🔍 [JWT 필터] 요청 시작: {}", requestURI);

        // permitAll 경로는 JWT 필터를 건너뜀
        if (shouldSkipFilter(requestURI)) {
            log.info("⏭️ [JWT 필터] permitAll 경로이므로 필터를 건너뜁니다: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // 요청 헤더에서 토큰 추출
        String token = resolveToken(request);

        if (token == null) {
            log.info("⚠️ [JWT 필터] 토큰이 없습니다. 인증 없이 진행합니다.");
        } else {
            log.info("✅ [JWT 필터] 토큰 추출 성공 (토큰 길이: {}자)", token.length());

            // 토큰이 있고 유효한 경우
            if (jwtTokenProvider.validateToken(token)) {
                log.info("✅ [JWT 필터] 토큰 검증 성공");

                // 토큰에서 이메일 추출
                String email = jwtTokenProvider.getEmailFromToken(token);
                log.info("✅ [JWT 필터] 이메일 추출 성공: {}", email);

                // UserDetails 조회
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                log.info("✅ [JWT 필터] 사용자 정보 조회 성공: {}", userDetails.getUsername());

                // 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                log.info("✅ [JWT 필터] 인증 객체(UsernamePasswordAuthenticationToken) 생성 완료");

                // 요청 정보 설정
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                log.info("✅ [JWT 필터] 요청 상세 정보 설정 완료");

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ [JWT 필터] SecurityContext에 인증 정보 저장 완료!");

                // 저장된 인증 정보 확인
                Authentication savedAuth = SecurityContextHolder.getContext().getAuthentication();
                if (savedAuth != null && savedAuth.isAuthenticated()) {
                    log.info("✅ [JWT 필터] 확인: SecurityContext에 인증 정보가 정상적으로 저장되었습니다. (인증된 사용자: {})", savedAuth.getName());
                } else {
                    log.error("❌ [JWT 필터] 오류: SecurityContext에 인증 정보가 저장되지 않았습니다!");
                }
            } else {
                log.warn("⚠️ [JWT 필터] 토큰 검증 실패 - 유효하지 않은 토큰입니다.");
            }
        }

        // 다음 필터로 진행
        log.info("➡️ [JWT 필터] 다음 필터로 진행합니다.");
        filterChain.doFilter(request, response);
    }

    /**
     * JWT 필터를 건너뛰어야 하는 경로인지 확인합니다.
     * 
     * @param requestURI 요청 URI
     * @return 건너뛰어야 하면 true
     */
    private boolean shouldSkipFilter(String requestURI) {
        // permitAll 경로 목록
        return requestURI.startsWith("/api/v1/auth/") ||
               requestURI.equals("/api/v1/users/signup") ||
               requestURI.startsWith("/api/v1/feature1/");
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

