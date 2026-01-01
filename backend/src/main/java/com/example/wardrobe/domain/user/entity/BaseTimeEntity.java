package com.example.wardrobe.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 공통 엔티티 클래스
 * 
 * 모든 엔티티가 상속받아 사용하는 기본 필드(생성일시, 수정일시)를 제공합니다.
 * JPA Auditing을 사용하여 자동으로 생성일시와 수정일시를 관리합니다.
 * 
 * @author Closet Canvas Team
 * @since 1.0
 */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    /**
     * 생성일시
     * 엔티티가 처음 생성된 시간을 자동으로 기록합니다.
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 수정일시
     * 엔티티가 마지막으로 수정된 시간을 자동으로 기록합니다.
     */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

