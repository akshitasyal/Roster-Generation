-- V9: Create leaves table
CREATE TABLE leaves (
    id           BIGSERIAL PRIMARY KEY,
    employee_id  BIGINT      NOT NULL REFERENCES employees(id),
    leave_type   VARCHAR(50) NOT NULL,
    -- CASUAL | SICK | EARNED | COMP_OFF | EMERGENCY | MATERNITY | PATERNITY | UNPAID
    start_date   DATE        NOT NULL,
    end_date     DATE        NOT NULL,
    status       VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING | APPROVED | REJECTED | CANCELLED | WITHDRAWN
    approved_by  BIGINT      REFERENCES employees(id),
    approved_at  TIMESTAMPTZ,
    reason       TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_leaves_employee_id  ON leaves(employee_id);
CREATE INDEX idx_leaves_status       ON leaves(status);
CREATE INDEX idx_leaves_dates        ON leaves(employee_id, start_date, end_date);
CREATE INDEX idx_leaves_start_date   ON leaves(start_date);
CREATE INDEX idx_leaves_approved_by  ON leaves(approved_by);

COMMENT ON TABLE leaves IS
    'Employee leave requests. Approved leave is a HARD constraint (H1) for the optimizer. '
    'Optimizer must check: for every day in [start_date, end_date] where status=APPROVED, '
    'no shift assignment is allowed.';
