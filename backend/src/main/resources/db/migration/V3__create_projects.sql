-- V3: Create projects table
CREATE TABLE projects (
    id           BIGSERIAL PRIMARY KEY,
    project_code VARCHAR(50)  NOT NULL UNIQUE,
    project_name VARCHAR(200) NOT NULL,
    description  TEXT,
    status       VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | INACTIVE | COMPLETED | ON_HOLD
    start_date   DATE,
    end_date     DATE,
    timezone     VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
    location     VARCHAR(100),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_code   ON projects(project_code);
CREATE INDEX idx_projects_status ON projects(status);

COMMENT ON TABLE projects IS 'Business projects. One project can contain multiple teams.';
COMMENT ON COLUMN projects.status IS 'ACTIVE | INACTIVE | COMPLETED | ON_HOLD';
