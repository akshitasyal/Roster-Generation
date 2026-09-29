-- V4: Create teams table
CREATE TABLE teams (
    id              BIGSERIAL PRIMARY KEY,
    team_code       VARCHAR(50)  NOT NULL UNIQUE,
    team_name       VARCHAR(200) NOT NULL,
    project_id      BIGINT       NOT NULL REFERENCES projects(id),
    tl_employee_id  BIGINT       REFERENCES employees(id),
    status          VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | INACTIVE | DISSOLVED
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teams_code        ON teams(team_code);
CREATE INDEX idx_teams_project_id  ON teams(project_id);
CREATE INDEX idx_teams_tl_id       ON teams(tl_employee_id);
CREATE INDEX idx_teams_status      ON teams(status);

COMMENT ON TABLE teams IS 'Teams within projects. One team belongs to one project and has a designated TL.';
