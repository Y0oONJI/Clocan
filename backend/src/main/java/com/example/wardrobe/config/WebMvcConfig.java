package com.example.wardrobe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Web MVC 설정 클래스
 * 
 * HTTP 응답 인코딩 및 JSON 직렬화 설정을 관리합니다.
 * 한글 깨짐 방지를 위해 UTF-8 인코딩을 명시적으로 설정합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // JSON 메시지 컨버터에 UTF-8 인코딩 설정
        converters.stream()
                .filter(converter -> converter instanceof MappingJackson2HttpMessageConverter)
                .map(converter -> (MappingJackson2HttpMessageConverter) converter)
                .forEach(converter -> converter.setDefaultCharset(StandardCharsets.UTF_8));
    }
}

