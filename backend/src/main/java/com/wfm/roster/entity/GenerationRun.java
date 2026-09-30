package com.wfm.roster.entity;

import com.wfm.employee.entity.Employee;
import com.wfm.planning.entity.PlanningCycle;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

/**
 * Generation run audit record.
 * Every optimization run has a record here - critical for production debugging.
 * Correlated with generation run ID (GR-YYYY-NNN) in structured logs.
 */
@Entity
@Table(name = "generation_runs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class GenerationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id")
    private RosterVersion rosterVersion;

    @Column(name = "scope", nullable = false, length = 50)
    @Builder.Default
    private String scope = "FULL_WEEK";

    @Column(name = "algorithm_name", nullable = false, length = 100)
    @Builder.Default
    private String algorithmName = "CP_SAT_ROSTER_V1";

    @Column(name = "algorithm_version", length = 50)
    private String algorithmVersion;

    @Column(name = "solver_name", nullable = false, length = 100)
    @Builder.Default
    private String solverName = "OR_TOOLS_CP_SAT";

    @CreatedDate
    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "RUNNING";
    // RUNNING | COMPLETED | FAILED | TIMED_OUT | CANCELLED

    @Column(name = "objective_value", precision = 15, scale = 4)
    private BigDecimal objectiveValue;

    @Column(name = "hard_violations")
    @Builder.Default
    private Integer hardViolations = 0;

    @Column(name = "coverage_gap")
    @Builder.Default
    private Integer coverageGap = 0;

    @Column(name = "execution_time_ms")
    private Long executionTimeMs;

    @Column(name = "solver_status", length = 50)
    private String solverStatus;
    // OPTIMAL | FEASIBLE | INFEASIBLE | UNKNOWN | TIMEOUT

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "run_params", columnDefinition = "jsonb")
    private Map<String, Object> runParams;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Employee createdBy;
}
