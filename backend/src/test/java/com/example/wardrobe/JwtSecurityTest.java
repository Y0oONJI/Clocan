package com.example.wardrobe;

import com.example.wardrobe.domain.auth.dto.TokenResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * JWT Security 테스트
 * 
 * JWT 토큰 검증 및 인증이 필요한 API 접근 테스트
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@SpringBootTest
@AutoConfigureMockMvc
class JwtSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-017
    @Test
    void 토큰없이_보호API_접근하면_401() throws Exception {
        mockMvc.perform(
                get("/api/v1/users/me")
                    .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-014
    @Test
    void 유효한토큰으로_보호API_접근하면_성공() throws Exception {
        // 1. 회원가입
        String signupBody = """
            {
              "email": "jwt@test.com",
              "password": "password123",
              "nickname": "JWT테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(signupBody)
        )
        .andExpect(status().isCreated());

        // 2. 로그인하여 토큰 받기
        String loginBody = """
            {
              "email": "jwt@test.com",
              "password": "password123"
            }
        """;

        String tokenResponse = mockMvc.perform(
                post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginBody)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").exists())
        .andReturn()
        .getResponse()
        .getContentAsString();

        // JSON에서 accessToken 추출
        TokenResponse token = objectMapper.readValue(tokenResponse, TokenResponse.class);
        String accessToken = token.accessToken();

        // 3. 토큰을 사용하여 보호된 API 접근
        mockMvc.perform(
                get("/api/v1/users/me")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("jwt@test.com"));
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-016
    @Test
    void 잘못된형식의토큰으로_보호API_접근하면_401() throws Exception {
        mockMvc.perform(
                get("/api/v1/users/me")
                    .header("Authorization", "Bearer invalid.token.here")
                    .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-017
    @Test
    void Bearer없이_토큰만_보내면_401() throws Exception {
        mockMvc.perform(
                get("/api/v1/users/me")
                    .header("Authorization", "some-token-without-bearer")
                    .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }
}
