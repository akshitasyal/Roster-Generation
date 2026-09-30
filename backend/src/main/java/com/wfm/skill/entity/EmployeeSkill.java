package com.wfm.skill.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Employee skill assignment with proficiency level.
 * valid_to = NULL means currently active.
 * Skill level: BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
 */
@Entity
@Table(name = "employee_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeSkill extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_level_id", nullable = false)
    private SkillLevel skillLevel;

    @Column(name = "certified", nullable = false)
    @Builder.Default
    private Boolean certified = false;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;
    // NULL = currently active

    /**
     * Returns true if skill meets the minimum required level.
     */
    public boolean meetsMinimumLevel(SkillLevel requiredLevel) {
        if (requiredLevel == null || this.skillLevel == null) return false;
        return this.skillLevel.getLevelWeight() >= requiredLevel.getLevelWeight();
    }

    /**
     * Returns true if this skill is active on the given date.
     */
    public boolean isActiveOn(LocalDate date) {
        return !date.isBefore(validFrom) &&
               (validTo == null || !date.isAfter(validTo));
    }
}
