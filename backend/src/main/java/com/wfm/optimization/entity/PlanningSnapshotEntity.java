package com.wfm.optimization.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.roster.entity.GenerationRun;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "planning_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanningSnapshotEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_run_id", nullable = false)
    private GenerationRun generationRun;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload_json", nullable = false, columnDefinition = "jsonb")
    private String payloadJson;

    @Column(name = "snapshot_version", length = 20)
    private String snapshotVersion;

    @Column(name = "algorithm_version", length = 20)
    private String algorithmVersion;

    @Column(name = "solver_version", length = 20)
    private String solverVersion;

    @Column(name = "configuration_version", length = 20)
    private String configurationVersion;
}
