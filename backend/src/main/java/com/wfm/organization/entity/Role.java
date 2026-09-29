package com.wfm.organization.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Role master entity.
 * Codes: ASSOCIATE | TL | AM | MANAGER | SENIOR_MANAGER | WFM
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;
}
