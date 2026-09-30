package com.wfm.optimization.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "optimization_weights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizationWeight extends BaseEntity {

    @Column(name = "objective_key", nullable = false, unique = true, length = 100)
    private String objectiveKey;

    @Column(name = "weight_value", nullable = false)
    private Integer weightValue;

    @Column(name = "description")
    private String description;
}
