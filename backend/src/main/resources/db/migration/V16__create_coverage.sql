-- V16: Create coverage table
CREATE TABLE coverage (
    id                  BIGSERIAL PRIMARY KEY,
    roster_version_id   BIGINT      NOT NULL REFERENCES roster_versions(id),
    project_id          BIGINT      NOT NULL REFERENCES projects(id),
    date                DATE        NOT NULL,
    interval_start      TIME        NOT NULL,
    interval_end        TIME        NOT NULL,
    shift_id            BIGINT      REFERENCES shifts(id),
    skill_id            BIGINT      REFERENCES skills(id),
    role_id             BIGINT      REFERENCES roles(id),
    required_headcount  INTEGER     NOT NULL DEFAULT 0,
    assigned_headcount  INTEGER     NOT NULL DEFAULT 0,
    gap                 INTEGER     GENERATED ALWAYS AS (
                            GREATEST(0, required_headcount - assigned_headcount)
                        ) STORED,
    excess              INTEGER     GENERATED ALWAYS AS (
                            GREATEST(0, assigned_headcount - required_headcount)
                        ) STORED,
    coverage_status     VARCHAR(30) NOT NULL DEFAULT 'COVERED',
    -- COVERED | SHORTAGE | EXCESS | NO_DEMAND
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coverage_version_id         ON coverage(roster_version_id);
CREATE INDEX idx_coverage_project_id         ON coverage(project_id);
CREATE INDEX idx_coverage_date               ON coverage(date);
CREATE INDEX idx_coverage_version_date       ON coverage(roster_version_id, date, interval_start);
CREATE INDEX idx_coverage_status             ON coverage(coverage_status);
CREATE INDEX idx_coverage_role_id            ON coverage(role_id);
CREATE INDEX idx_coverage_skill_id           ON coverage(skill_id);

COMMENT ON TABLE coverage IS
    'Coverage calculated after roster generation. '
    'gap and excess are computed columns. '
    'SHORTAGE does not fail the roster - it creates an exception. '
    'Coverage is evaluated by: date, interval, shift, project, role, skill.';
