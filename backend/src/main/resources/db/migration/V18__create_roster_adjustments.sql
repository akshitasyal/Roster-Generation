-- V18: Create roster_adjustments table
CREATE TABLE roster_adjustments (
    id                    BIGSERIAL PRIMARY KEY,
    roster_version_id     BIGINT      NOT NULL REFERENCES roster_versions(id),
    roster_assignment_id  BIGINT      NOT NULL REFERENCES roster_assignments(id),
    employee_id           BIGINT      NOT NULL REFERENCES employees(id),
    date                  DATE        NOT NULL,
    old_shift_id          BIGINT      REFERENCES shifts(id),
    new_shift_id          BIGINT      REFERENCES shifts(id),
    old_assignment_type   VARCHAR(30),
    new_assignment_type   VARCHAR(30),
    adjustment_type       VARCHAR(50) NOT NULL,
    -- SHIFT_CHANGE | AVAILABILITY_REPLACEMENT | WFM_OVERRIDE | POST_PUBLISH_CHANGE | COVERAGE_ADJUSTMENT
    reason                TEXT,
    validation_result     VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING | VALID | INVALID
    validation_errors     JSONB,
    -- Stores detailed validation error messages if INVALID
    requested_by          BIGINT      REFERENCES employees(id),
    approved_by           BIGINT      REFERENCES employees(id),
    status                VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING | APPROVED | REJECTED | APPLIED | REVERTED
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roster_adj_version_id    ON roster_adjustments(roster_version_id);
CREATE INDEX idx_roster_adj_assignment_id ON roster_adjustments(roster_assignment_id);
CREATE INDEX idx_roster_adj_employee_id   ON roster_adjustments(employee_id);
CREATE INDEX idx_roster_adj_date          ON roster_adjustments(date);
CREATE INDEX idx_roster_adj_status        ON roster_adjustments(status);
CREATE INDEX idx_roster_adj_type          ON roster_adjustments(adjustment_type);

COMMENT ON TABLE roster_adjustments IS
    'All manual adjustments to roster assignments. '
    'WFM manual overrides, replacements, post-publish changes. '
    'validation_errors stores why an adjustment was rejected. '
    'Published roster changes MUST go through adjustments.';
