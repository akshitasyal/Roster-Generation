package com.wfm.project.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Project entity. One project contains multiple teams.
 * Project != Team != Shift.
 */
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @Column(name = "project_code", nullable = false, unique = true, length = 50)
    private String projectCode;

    @Column(name = "project_name", nullable = false, length = 200)
    private String projectName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | INACTIVE | COMPLETED | ON_HOLD

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "timezone", nullable = false, length = 100)
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "location", length = 100)
    private String location;
}
