package com.wfm.demand.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.organization.entity.Role;
import com.wfm.project.entity.Project;
import com.wfm.shift.entity.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "management_coverage_requirements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagementCoverageRequirement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @Column(name = "min_required", nullable = false)
    @Builder.Default
    private Integer minRequired = 1;

    @Column(name = "day_type", nullable = false, length = 20)
    @Builder.Default
    private String dayType = "ALL";
    // ALL | WEEKDAY | WEEKEND | HOLIDAY

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;
}
