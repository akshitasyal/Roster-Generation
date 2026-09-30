-- V31: Users, Roster Replacements, Working Hours Policies, and V30 refinements
-- See: docs/second_pass_refinement.md SECTION B

-- 1. USERS TABLE
CREATE TABLE users (
    id              BIGSERIAL    PRIMARY KEY,
    employee_id     BIGINT       UNIQUE REFERENCES employees(id) ON DELETE SET NULL,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    failed_attempts INT          NOT NULL DEFAULT 0,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username    ON users(username);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_status      ON users(status);

-- 2. ROSTER REPLACEMENTS TABLE
CREATE TABLE roster_replacements (
    id                       BIGSERIAL    PRIMARY KEY,
    original_assignment_id   BIGINT       NOT NULL REFERENCES roster_assignments(id),
    original_employee_id     BIGINT       NOT NULL REFERENCES employees(id),
    replacement_employee_id  BIGINT       REFERENCES employees(id),
    date                     DATE         NOT NULL,
    shift_id                 BIGINT       REFERENCES shifts(id),
    reason                   TEXT         NOT NULL,
    reason_type              VARCHAR(50)  NOT NULL,
    replacement_status       VARCHAR(30)  NOT NULL DEFAULT 'PENDING',
    requested_by             BIGINT       NOT NULL REFERENCES employees(id),
    approved_by              BIGINT       REFERENCES employees(id),
    approved_at              TIMESTAMPTZ,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_replacements_date           ON roster_replacements(date);
CREATE INDEX idx_replacements_orig_assign    ON roster_replacements(original_assignment_id);
CREATE INDEX idx_replacements_orig_emp       ON roster_replacements(original_employee_id);
CREATE INDEX idx_replacements_repl_emp       ON roster_replacements(replacement_employee_id);
CREATE INDEX idx_replacements_status         ON roster_replacements(replacement_status);
CREATE INDEX idx_replacements_requested_by   ON roster_replacements(requested_by);

-- 3. WORKING HOURS POLICIES TABLE
CREATE TABLE working_hours_policies (
    id                   BIGSERIAL    PRIMARY KEY,
    project_id           BIGINT       REFERENCES projects(id),
    regular_hours        DECIMAL(4,2) NOT NULL DEFAULT 8.0,
    maximum_hours        DECIMAL(4,2) NOT NULL DEFAULT 9.0,
    overtime_allowed     BOOLEAN      NOT NULL DEFAULT TRUE,
    maximum_overtime_hrs DECIMAL(4,2) NOT NULL DEFAULT 1.0,
    effective_from       DATE         NOT NULL,
    effective_to         DATE,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_working_hours_policy UNIQUE (project_id, effective_from)
);

CREATE INDEX idx_working_hours_project ON working_hours_policies(project_id);
CREATE INDEX idx_working_hours_dates   ON working_hours_policies(effective_from, effective_to);

-- 4. SCHEMA ALTERATIONS TO V30 TABLES

ALTER TABLE management_coverage_requirements
    ADD COLUMN day_type VARCHAR(20) NOT NULL DEFAULT 'ALL';

ALTER TABLE shift_interval_coverage
    ADD COLUMN effective_from DATE NOT NULL DEFAULT '2026-01-01',
    ADD COLUMN effective_to   DATE;

ALTER TABLE roster_rule_configurations
    ADD COLUMN project_id BIGINT REFERENCES projects(id);

ALTER TABLE roster_rule_configurations DROP CONSTRAINT uq_rule_effective;
ALTER TABLE roster_rule_configurations
    ADD CONSTRAINT uq_rule_project_effective UNIQUE (rule_key, project_id, effective_date);

ALTER TABLE planning_snapshots
    ADD COLUMN snapshot_version      VARCHAR(20),
    ADD COLUMN algorithm_version     VARCHAR(20),
    ADD COLUMN solver_version        VARCHAR(20),
    ADD COLUMN configuration_version VARCHAR(20);

-- 5. SEED GLOBAL WORKING HOURS POLICY
INSERT INTO working_hours_policies
    (project_id, regular_hours, maximum_hours, overtime_allowed, maximum_overtime_hrs, effective_from)
VALUES
    (NULL, 8.0, 9.0, TRUE, 1.0, '2026-01-01');

-- 6. SEED ADDITIONAL ROSTER RULE CONFIGURATIONS
INSERT INTO roster_rule_configurations (rule_key, rule_value, effective_date, description, project_id) VALUES
('REGULAR_HOURS',             '8',                      '2026-01-01', 'Standard daily hours for overtime calculation', NULL),
('WEEKEND_DAYS',              'SATURDAY,SUNDAY',         '2026-01-01', 'Comma-separated weekend day names', NULL),
('WFM_SCHEDULING_MODE',       'COVERAGE_DRIVEN',         '2026-01-01', 'WFM scheduling: COVERAGE_DRIVEN or FIXED or INDEPENDENT', NULL),
('TIE_BREAK_STRATEGY',        'CONTINUITY,COVERAGE,PREFERENCE,WORKLOAD,SHIFT_CODE', '2026-01-01', 'Management tie-break priority order', NULL),
('LEAVE_COUNTS_AS_OFF',       'false',                   '2026-01-01', 'If true, leave days count as weekly off', NULL),
('WFM_HARD_CONSTRAINT_BYPASS','false',                   '2026-01-01', 'Never set true: WFM cannot bypass H1-H6', NULL),
('MANAGEMENT_REPLACEMENT',    'MANUAL',                  '2026-01-01', 'MANUAL: management replacement is human-only', NULL),
('SOLVER_TIME_LIMIT_SECONDS', '120',                     '2026-01-01', 'CP-SAT solver timeout seconds', NULL),
('SOLVER_NUM_WORKERS',        '4',                       '2026-01-01', 'CP-SAT parallel worker thread count', NULL);
