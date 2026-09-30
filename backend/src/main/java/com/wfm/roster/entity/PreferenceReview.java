package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.preference.entity.EmployeePreference;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "preference_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenceReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preference_id", nullable = false)
    private EmployeePreference preference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private Employee reviewer;

    @Column(name = "decision", nullable = false, length = 30)
    @Builder.Default
    private String decision = "PENDING";
    // PENDING, DECLINED, AUTO_ACCEPTED

    @Column(name = "reason")
    private String reason;

    @Column(name = "reviewed_at")
    private ZonedDateTime reviewedAt;

    @Column(name = "deadline")
    private ZonedDateTime deadline;
}
