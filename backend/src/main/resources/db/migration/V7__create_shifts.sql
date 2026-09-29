-- V7: Create shifts table
CREATE TABLE shifts (
    id             BIGSERIAL PRIMARY KEY,
    shift_code     VARCHAR(50)  NOT NULL UNIQUE,
    shift_name     VARCHAR(200) NOT NULL,
    shift_type     VARCHAR(30)  NOT NULL,
    -- MORNING | GENERAL | EVENING | NIGHT | CUSTOM
    start_time     TIME         NOT NULL,
    end_time       TIME         NOT NULL,
    duration_hours DECIMAL(5,2) NOT NULL,
    is_overnight   BOOLEAN      NOT NULL DEFAULT FALSE,
    -- true if shift crosses midnight
    status         VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | INACTIVE
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shifts_code   ON shifts(shift_code);
CREATE INDEX idx_shifts_type   ON shifts(shift_type);
CREATE INDEX idx_shifts_status ON shifts(status);

COMMENT ON TABLE shifts IS
    'Shift master. Times are configurable - never hard-coded. '
    'is_overnight=true when shift crosses midnight (e.g. 22:00-07:00). '
    'duration_hours accounts for overnight calculation. '
    'Shift gap rule: minimum 11 hours rest between two shifts (configurable).';


-- V7b: Create shift_eligibility table
-- IMPORTANT: eligibility is stored as individual rows per employee per shift.
-- NOT as a comma-separated string like "M/G/E".
CREATE TABLE shift_eligibility (
    id             BIGSERIAL PRIMARY KEY,
    employee_id    BIGINT      NOT NULL REFERENCES employees(id),
    shift_id       BIGINT      NOT NULL REFERENCES shifts(id),
    effective_from DATE        NOT NULL,
    effective_to   DATE,
    is_eligible    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_shift_eligibility UNIQUE (employee_id, shift_id, effective_from),
    CONSTRAINT chk_shift_eligibility_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE INDEX idx_shift_eligibility_employee_id   ON shift_eligibility(employee_id);
CREATE INDEX idx_shift_eligibility_shift_id      ON shift_eligibility(shift_id);
CREATE INDEX idx_shift_eligibility_composite     ON shift_eligibility(employee_id, shift_id);
CREATE INDEX idx_shift_eligibility_eligible      ON shift_eligibility(is_eligible) WHERE is_eligible = TRUE;

COMMENT ON TABLE shift_eligibility IS
    'Per-employee, per-shift eligibility rows. '
    'Example: employee E01 eligible for Morning, Evening gets 2 rows. '
    'NOT stored as M/E string. effective_to=NULL means currently active.';
