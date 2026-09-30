package com.wfm.skill.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "skill_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillLevel extends BaseEntity {

    @Column(name = "level_code", nullable = false, unique = true, length = 50)
    private String levelCode;

    @Column(name = "level_weight", nullable = false)
    private Integer levelWeight;

    @Column(name = "description", length = 200)
    private String description;
}
