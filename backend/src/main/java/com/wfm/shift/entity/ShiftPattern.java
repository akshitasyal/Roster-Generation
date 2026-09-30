package com.wfm.shift.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "shift_patterns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftPattern extends BaseEntity {

    @Column(name = "pattern_code", nullable = false, unique = true, length = 50)
    private String patternCode;

    @Column(name = "pattern_type", nullable = false, length = 50)
    private String patternType;
    // DAY_ONLY, NIGHT_ONLY, ROTATIONAL, CUSTOM

    @Column(name = "description", length = 200)
    private String description;
}
