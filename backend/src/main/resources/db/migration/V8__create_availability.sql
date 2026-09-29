-- V8: Create availability table
CREATE TABLE availability (
    id                  BIGSERIAL PRIMARY KEY,
    employee_id         BIGINT      NOT NULL REFERENCES employees(id),
    date                DATE        NOT NULL,
    available_from      TIME,
    -- NULL = full day availability
    available_to        TIME,
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    -- AVAILABLE | UNAVAILABLE | PARTIAL | RESTRICTED
    reason              TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_availability_employee_date UNIQUE (employee_id, date)
);

CREATE INDEX idx_availability_employee_id   ON availability(employee_id);
CREATE INDEX idx_availability_date          ON availability(date);
CREATE INDEX idx_availability_employee_date ON availability(employee_id, date);
CREATE INDEX idx_availability_status        ON availability(availability_status);

COMMENT ON TABLE availability IS
    'Employee daily availability. Overrides default availability. '
    'UNAVAILABLE is a hard constraint (H5). '
    'PARTIAL = limited hours. RESTRICTED = specific window only.';
