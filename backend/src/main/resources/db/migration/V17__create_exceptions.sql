-- V17: Create exceptions table
CREATE TABLE exceptions (
    id                BIGSERIAL PRIMARY KEY,
    roster_version_id BIGINT      NOT NULL REFERENCES roster_versions(id),
    planning_cycle_id BIGINT      NOT NULL REFERENCES planning_cycles(id),
    exception_type    VARCHAR(50) NOT NULL,
    -- STAFFING_SHORTAGE | SKILL_SHORTAGE | NO_ELIGIBLE_EMPLOYEE
    -- AVAILABILITY_CONFLICT | MANUAL_OVERRIDE_REQUIRED | REST_VIOLATION
    -- CONSECUTIVE_DAY_VIOLATION | MANAGEMENT_COVERAGE_CONFLICT
    -- PREFERENCE_VIOLATION | OTHER
    severity          VARCHAR(20) NOT NULL DEFAULT 'WARNING',
    -- INFO | WARNING | ERROR | CRITICAL
    employee_id       BIGINT      REFERENCES employees(id),
    date              DATE,
    shift_id          BIGINT      REFERENCES shifts(id),
    skill_id          BIGINT      REFERENCES skills(id),
    role_id           BIGINT      REFERENCES roles(id),
    required_count    INTEGER,
    assigned_count    INTEGER,
    gap               INTEGER,
    description       TEXT        NOT NULL,
    status            VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    -- OPEN | ACKNOWLEDGED | RESOLVED | ESCALATED | DISMISSED
    resolved_by       BIGINT      REFERENCES employees(id),
    resolved_at       TIMESTAMPTZ,
    resolution_notes  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exceptions_version_id    ON exceptions(roster_version_id);
CREATE INDEX idx_exceptions_cycle_id      ON exceptions(planning_cycle_id);
CREATE INDEX idx_exceptions_type          ON exceptions(exception_type);
CREATE INDEX idx_exceptions_severity      ON exceptions(severity);
CREATE INDEX idx_exceptions_status        ON exceptions(status);
CREATE INDEX idx_exceptions_employee_id   ON exceptions(employee_id);
CREATE INDEX idx_exceptions_version_status ON exceptions(roster_version_id, status);

COMMENT ON TABLE exceptions IS
    'Exceptions generated during roster creation and validation. '
    'Staffing shortage is NOT a hard failure - it creates an OPEN exception. '
    'Exceptions require WFM human attention and resolution.';
