-- V13: Create holidays and project_holiday_policies tables
CREATE TABLE holidays (
    id           BIGSERIAL PRIMARY KEY,
    holiday_name VARCHAR(200) NOT NULL,
    holiday_date DATE         NOT NULL,
    holiday_type VARCHAR(30)  NOT NULL DEFAULT 'PUBLIC',
    -- PUBLIC | OPTIONAL | RESTRICTED | COMPANY
    country      VARCHAR(100),
    state        VARCHAR(100),
    location     VARCHAR(100),
    is_optional  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_holidays_date     ON holidays(holiday_date);
CREATE INDEX idx_holidays_type     ON holidays(holiday_type);
CREATE INDEX idx_holidays_location ON holidays(location);

COMMENT ON TABLE holidays IS
    'Holiday master. Public holiday does NOT automatically mean all employees are off. '
    'Project-level policy (project_holiday_policies) determines actual behavior.';


CREATE TABLE project_holiday_policies (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT      NOT NULL REFERENCES projects(id),
    holiday_id        BIGINT      NOT NULL REFERENCES holidays(id),
    policy            VARCHAR(30) NOT NULL DEFAULT 'OPERATIONAL',
    -- CLOSED | OPERATIONAL | PARTIAL
    required_staffing INTEGER,
    -- Required staffing percentage if PARTIAL
    allow_work        BOOLEAN     NOT NULL DEFAULT TRUE,
    comp_off_enabled  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_project_holiday_policy UNIQUE (project_id, holiday_id)
);

CREATE INDEX idx_project_holiday_policy_project_id ON project_holiday_policies(project_id);
CREATE INDEX idx_project_holiday_policy_holiday_id ON project_holiday_policies(holiday_id);

COMMENT ON TABLE project_holiday_policies IS
    'Project-level holiday policy. '
    'CLOSED: all employees off. '
    'OPERATIONAL: normal operation, holiday treated as regular day. '
    'PARTIAL: reduced staffing, required_staffing % applies.';
