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

    @Column(name = "skill_level", nullable = false, length = 30)
    @Builder.Default
    private String skillLevel = "BEGINNER";
    // BEGINNER | INTERMEDIATE | ADVANCED | EXPERT

    @Column(name = "certified", nullable = false)
    @Builder.Default
    private Boolean certified = false;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;
    // NULL = currently active

    /**
     * Returns skill level as numeric for comparison.
     * BEGINNER=1, INTERMEDIATE=2, ADVANCED=3, EXPERT=4
     */
    public int getSkillLevelNumeric() {
        return switch (skillLevel) {
            case "EXPERT"       -> 4;
            case "ADVANCED"     -> 3;
            case "INTERMEDIATE" -> 2;
            default             -> 1; // BEGINNER
        };
    }

    /**
     * Returns true if skill meets the minimum required level.
     */
    public boolean meetsMinimumLevel(String requiredLevel) {
        int required = switch (requiredLevel) {
            case "EXPERT"       -> 4;
            case "ADVANCED"     -> 3;
            case "INTERMEDIATE" -> 2;
            default             -> 1;
        };
        return getSkillLevelNumeric() >= required;
    }

    /**
     * Returns true if this skill is active on the given date.
     */
    public boolean isActiveOn(LocalDate date) {
        return !date.isBefore(validFrom) &&
               (validTo == null || !date.isAfter(validTo));
    }
}
