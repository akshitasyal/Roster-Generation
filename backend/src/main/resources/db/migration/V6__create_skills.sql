-- V6: Create skills table
CREATE TABLE skills (
    id          BIGSERIAL PRIMARY KEY,
    skill_code  VARCHAR(50)  NOT NULL UNIQUE,
    skill_name  VARCHAR(200) NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    status      VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | DEPRECATED
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_code   ON skills(skill_code);
CREATE INDEX idx_skills_status ON skills(status);

COMMENT ON TABLE skills IS 'Skill master (e.g. CUSTOMER_SUPPORT, TECHNICAL_SUPPORT, BILLING).';


-- V6b: Create employee_skills table
CREATE TABLE employee_skills (
    id          BIGSERIAL PRIMARY KEY,
    employee_id BIGINT      NOT NULL REFERENCES employees(id),
    skill_id    BIGINT      NOT NULL REFERENCES skills(id),
    skill_level VARCHAR(30) NOT NULL DEFAULT 'BEGINNER',
    -- BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
    certified   BOOLEAN     NOT NULL DEFAULT FALSE,
    valid_from  DATE        NOT NULL,
    valid_to    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_employee_skill_active UNIQUE (employee_id, skill_id, valid_from),
    CONSTRAINT chk_employee_skill_dates CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

CREATE INDEX idx_employee_skills_employee_id ON employee_skills(employee_id);
CREATE INDEX idx_employee_skills_skill_id    ON employee_skills(skill_id);
CREATE INDEX idx_employee_skills_composite   ON employee_skills(employee_id, skill_id);
CREATE INDEX idx_employee_skills_level       ON employee_skills(skill_level);

COMMENT ON TABLE employee_skills IS
    'Employee skill assignments with levels. valid_to=NULL means currently active. '
    'Skill level: BEGINNER | INTERMEDIATE | ADVANCED | EXPERT.';
