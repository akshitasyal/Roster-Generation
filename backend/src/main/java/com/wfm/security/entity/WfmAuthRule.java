package com.wfm.security.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Configurable rule for identifying WFM portal users.
 * <p>
 * All non-null conditions in a rule must match the employee for WFM access to be granted.
 * Multiple active rules are OR'd — if ANY rule matches, the employee is WFM.
 * </p>
 *
 * Current default rule (seeded in V38):
 *   designation_equals = 'Senior Manager'
 *   skill_equals       = 'Workforce Management'
 */
@Entity
@Table(name = "wfm_auth_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WfmAuthRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_name", nullable = false, unique = true, length = 100)
    private String ruleName;

    /** If set, employee's designation must equal this value. */
    @Column(name = "designation_equals", length = 100)
    private String designationEquals;

    /** If set, employee's skill must equal this value. */
    @Column(name = "skill_equals", length = 255)
    private String skillEquals;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    /** Lower number = checked first. */
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private Integer priority = 0;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
