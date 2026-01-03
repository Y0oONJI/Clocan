package com.example.wardrobe;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 로그인 테스트
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthLoginTest {

    @Autowired
    private MockMvc mockMvc;

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-008, TC-AUTH-013
    @Test
    void 로그인_성공() throws Exception {
        // 1. 먼저 회원가입
        String signupBody = """
            {
              "email": "login@test.com",
              "password": "password123",
              "nickname": "로그인테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(signupBody)
        )
        .andExpect(status().isCreated());

        // 2. 로그인
        String loginBody = """
            {
              "email": "login@test.com",
              "password": "password123"
            }
        """;

        mockMvc.perform(
                post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginBody)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").exists())
        .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }
}
