-- V30: Second-Pass Architecture refinements

-- 1. Skill Levels Model
CREATE TABLE skill_levels (
    id           BIGSERIAL PRIMARY KEY,
    level_code   VARCHAR(50)  NOT NULL UNIQUE,
    level_weight INT          NOT NULL,
    description  VARCHAR(200)
);

INSERT INTO skill_levels (level_code, level_weight, description) VALUES
('BEGINNER', 1, 'Basic understanding'),
('INTERMEDIATE', 2, 'Working knowledge'),
('ADVANCED', 3, 'High proficiency'),
('EXPERT', 4, 'Subject matter expert');

-- Upgrade employee_skills to use skill_level_id
ALTER TABLE employee_skills ADD COLUMN skill_level_id BIGINT;
UPDATE employee_skills es SET skill_level_id = sl.id FROM skill_levels sl WHERE UPPER(es.skill_level) = sl.level_code;
ALTER TABLE employee_skills ALTER COLUMN skill_level_id SET NOT NULL;
ALTER TABLE employee_skills ADD CONSTRAINT fk_employee_skills_level FOREIGN KEY (skill_level_id) REFERENCES skill_levels(id);
ALTER TABLE employee_skills DROP COLUMN skill_level;

-- Upgrade demand to include skill_level_id
ALTER TABLE demand ADD COLUMN skill_level_id BIGINT REFERENCES skill_levels(id);


-- 2. Shift Interval Coverage Model
CREATE TABLE shift_interval_coverage (
    id               BIGSERIAL PRIMARY KEY,
    shift_id         BIGINT  NOT NULL REFERENCES shifts(id),
    interval_start   TIME    NOT NULL,
    interval_end     TIME    NOT NULL,
    coverage_factor  DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_shift_interval UNIQUE (shift_id, interval_start, interval_end)
);

-- Note: In production this would be populated programmatically based on shift times


-- 3. Shift Patterns Model
CREATE TABLE shift_patterns (
    id           BIGSERIAL PRIMARY KEY,
    pattern_code VARCHAR(50)  NOT NULL UNIQUE,
    pattern_type VARCHAR(50)  NOT NULL, -- DAY_ONLY, NIGHT_ONLY, ROTATIONAL, CUSTOM
    description  VARCHAR(200)
);

INSERT INTO shift_patterns (pattern_code, pattern_type, description) VALUES
('DAY_ONLY', 'DAY_ONLY', 'Only allowed on day shifts'),
('NIGHT_ONLY', 'NIGHT_ONLY', 'Only allowed on night shifts'),
('ROTATIONAL_WEEKLY', 'ROTATIONAL', 'Rotates day/night weekly');

-- Assign pattern to employee project assignments (or employee_org_assignments)
ALTER TABLE employee_org_assignments ADD COLUMN shift_pattern_id BIGINT REFERENCES shift_patterns(id);


-- 4. Roster Rule Configurations
CREATE TABLE roster_rule_configurations (
    id             BIGSERIAL PRIMARY KEY,
    rule_key       VARCHAR(100) NOT NULL,
    rule_value     VARCHAR(200) NOT NULL,
    effective_date DATE         NOT NULL,
    description    TEXT,
    
    CONSTRAINT uq_rule_effective UNIQUE (rule_key, effective_date)
);

INSERT INTO roster_rule_configurations (rule_key, rule_value, effective_date, description) VALUES
('MIN_REST_HOURS', '11', '2026-01-01', 'Minimum rest between shifts'),
('MAX_WORKING_HOURS', '9', '2026-01-01', 'Maximum shift duration per day'),
('MAX_CONSECUTIVE_DAYS', '6', '2026-01-01', 'Max consecutive work days'),
('WEEKLY_OFF_COUNT', '2', '2026-01-01', 'Number of required weekly offs');


-- 5. Optimization Weights
CREATE TABLE optimization_weights (
    id             BIGSERIAL PRIMARY KEY,
    objective_key  VARCHAR(100) NOT NULL UNIQUE,
    weight_value   INT          NOT NULL,
    description    TEXT
);

INSERT INTO optimization_weights (objective_key, weight_value, description) VALUES
('WEIGHT_SHORTAGE', 10000, 'Penalty for demand shortage'),
('WEIGHT_PREFERENCE', 100, 'Reward for honoring shift preferences'),
('WEIGHT_WEEKLY_OFF_PREF', 150, 'Reward for honoring weekly off preference'),
('WEIGHT_OVERTIME', -50, 'Penalty for overtime');


-- 6. Management Coverage Requirements (Explicit Table)
CREATE TABLE management_coverage_requirements (
    id             BIGSERIAL PRIMARY KEY,
    project_id     BIGINT NOT NULL REFERENCES projects(id),
    role_id        BIGINT NOT NULL REFERENCES roles(id),
    shift_id       BIGINT NOT NULL REFERENCES shifts(id),
    min_required   INT    NOT NULL DEFAULT 1,
    effective_from DATE   NOT NULL,
    effective_to   DATE,
    
    CONSTRAINT uq_mgmt_coverage UNIQUE (project_id, role_id, shift_id, effective_from)
);


-- 7. Preference Reviews Workflow
CREATE TABLE preference_reviews (
    id            BIGSERIAL PRIMARY KEY,
    preference_id BIGINT      NOT NULL REFERENCES employee_preferences(id),
    reviewer_id   BIGINT      REFERENCES employees(id),
    decision      VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, DECLINED, AUTO_ACCEPTED
    reason        TEXT,
    reviewed_at   TIMESTAMPTZ,
    deadline      TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 8. Assignment Explanations (Explainability)
CREATE TABLE assignment_explanations (
    id               BIGSERIAL PRIMARY KEY,
    assignment_id    BIGINT NOT NULL REFERENCES roster_assignments(id),
    explanation_json JSONB  NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 9. Planning Snapshots
CREATE TABLE planning_snapshots (
    id                BIGSERIAL PRIMARY KEY,
    generation_run_id BIGINT NOT NULL REFERENCES generation_runs(id),
    payload_json      JSONB  NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
