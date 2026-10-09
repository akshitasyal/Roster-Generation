-- V5: Create employee_org_assignments table
CREATE TABLE employee_org_assignments (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT      NOT NULL REFERENCES employees(id),
    project_id      BIGINT      REFERENCES projects(id),
    team_id         BIGINT      REFERENCES teams(id),
    reports_to_id   BIGINT      REFERENCES employees(id),
    effective_from  DATE        NOT NULL,
    effective_to    DATE,
    is_primary      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_org_assignment_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE INDEX idx_employee_org_employee_id   ON employee_org_assignments(employee_id);
CREATE INDEX idx_employee_org_project_id    ON employee_org_assignments(project_id);
CREATE INDEX idx_employee_org_team_id       ON employee_org_assignments(team_id);
CREATE INDEX idx_employee_org_reports_to_id ON employee_org_assignments(reports_to_id);

COMMENT ON TABLE employee_org_assignments IS 'Tracks which project/team an employee belongs to, and who they report to.';
