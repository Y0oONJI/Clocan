package com.example.wardrobe;

import com.example.wardrobe.config.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

/**
 * 애플리케이션 컨텍스트 로딩 테스트
 * 
 * 테스트 환경에서는 TestSecurityConfig를 사용하여 Security가 테스트를 막지 않도록 합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@SpringBootTest
@Import(TestSecurityConfig.class)
class WardrobeApplicationTests {

    @Test
    void contextLoads() {
        // 애플리케이션 컨텍스트가 정상적으로 로드되는지 확인
    }
}

