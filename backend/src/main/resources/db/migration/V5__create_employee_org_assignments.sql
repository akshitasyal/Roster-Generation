-- V5: Create employee_org_assignments table (preserves historical hierarchy)
CREATE TABLE employee_org_assignments (
    id             BIGSERIAL PRIMARY KEY,
    employee_id    BIGINT      NOT NULL REFERENCES employees(id),
    project_id     BIGINT      NOT NULL REFERENCES projects(id),
    team_id        BIGINT      REFERENCES teams(id),
    reports_to_id  BIGINT      REFERENCES employees(id),
    effective_from DATE        NOT NULL,
    effective_to   DATE,
    -- NULL = currently active
    is_primary     BOOLEAN     NOT NULL DEFAULT TRUE,
    -- Primary org assignment for the employee
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_org_assignment_dates CHECK (
        effective_to IS NULL OR effective_to >= effective_from
    )
);

CREATE INDEX idx_eoa_employee_id       ON employee_org_assignments(employee_id);
CREATE INDEX idx_eoa_employee_dates    ON employee_org_assignments(employee_id, effective_from, effective_to);
CREATE INDEX idx_eoa_team_id           ON employee_org_assignments(team_id);
CREATE INDEX idx_eoa_reports_to_id     ON employee_org_assignments(reports_to_id);
CREATE INDEX idx_eoa_project_id        ON employee_org_assignments(project_id);
CREATE INDEX idx_eoa_effective_from    ON employee_org_assignments(effective_from);
CREATE INDEX idx_eoa_is_primary        ON employee_org_assignments(is_primary) WHERE is_primary = TRUE;

COMMENT ON TABLE employee_org_assignments IS
    'Historical org hierarchy assignments. effective_to=NULL means currently active. '
    'Employees can change team, TL, AM, manager, project over time. '
    'All historical relationships are preserved here.';
