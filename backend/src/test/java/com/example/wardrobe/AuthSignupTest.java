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
 * 회원가입 테스트
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthSignupTest {

    @Autowired
    private MockMvc mockMvc;

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-001
    @Test
    void 회원가입_성공() throws Exception {
        String body = """
            {
              "email": "test@test.com",
              "password": "password123",
              "nickname": "테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
        )
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.email").value("test@test.com"))
        .andExpect(jsonPath("$.nickname").value("테스트유저"));
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-002
    @Test
    void 회원가입_실패_중복이메일() throws Exception {
        // 첫 번째 회원가입
        String firstBody = """
            {
              "email": "duplicate@test.com",
              "password": "password123",
              "nickname": "첫번째유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(firstBody)
        )
        .andExpect(status().isCreated());

        // 동일한 이메일로 두 번째 회원가입 시도
        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(firstBody)
        )
        .andExpect(status().isConflict())  // 409 Conflict (중복 이메일)
        .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다: duplicate@test.com"));
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-003
    @Test
    void 회원가입_실패_잘못된이메일형식() throws Exception {
        String body = """
            {
              "email": "잘못된이메일",
              "password": "password123",
              "nickname": "테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
        )
        .andExpect(status().isBadRequest());
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-004
    @Test
    void 회원가입_실패_비밀번호8자미만() throws Exception {
        String body = """
            {
              "email": "test@test.com",
              "password": "1234567",
              "nickname": "테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
        )
        .andExpect(status().isBadRequest());
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-006
    @Test
    void 회원가입_실패_이메일누락() throws Exception {
        String body = """
            {
              "password": "password123",
              "nickname": "테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
        )
        .andExpect(status().isBadRequest());
    }

    // Verified: REQ-FUNC-001
    // Test Case: TC-AUTH-007
    @Test
    void 회원가입_실패_비밀번호누락() throws Exception {
        String body = """
            {
              "email": "test@test.com",
              "nickname": "테스트유저"
            }
        """;

        mockMvc.perform(
                post("/api/v1/users/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
        )
        .andExpect(status().isBadRequest());
    }

}
