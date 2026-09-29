package com.wfm.team.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;

/**
 * Team entity. Belongs to one Project, has a designated TL.
 */
@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {

    @Column(name = "team_code", nullable = false, unique = true, length = 50)
    private String teamCode;

    @Column(name = "team_name", nullable = false, length = 200)
    private String teamName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tl_employee_id")
    private Employee tlEmployee;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | INACTIVE | DISSOLVED
}
