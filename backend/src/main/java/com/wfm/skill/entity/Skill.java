package com.wfm.skill.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Skill master entity.
 * Examples: CUSTOMER_SUPPORT, TECHNICAL_SUPPORT, BILLING, ESCALATION, QUALITY
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {

    @Column(name = "skill_code", nullable = false, unique = true, length = 50)
    private String skillCode;

    @Column(name = "skill_name", nullable = false, length = 200)
    private String skillName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | DEPRECATED
}
