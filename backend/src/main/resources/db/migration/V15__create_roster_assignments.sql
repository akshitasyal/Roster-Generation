-- V15: Create roster_assignments (THE CENTRAL ROSTER TABLE)
-- ALL roles stored here: Associate, TL, AM, Manager, Senior Manager, WFM
-- Do NOT create separate tables per role.

CREATE TABLE roster_assignments (
    id                BIGSERIAL PRIMARY KEY,
    roster_version_id BIGINT      NOT NULL REFERENCES roster_versions(id),
    employee_id       BIGINT      NOT NULL REFERENCES employees(id),
    project_id        BIGINT      NOT NULL REFERENCES projects(id),
    team_id           BIGINT      REFERENCES teams(id),
    date              DATE        NOT NULL,
    shift_id          BIGINT      REFERENCES shifts(id),
    -- NULL if assignment_type = OFF | LEAVE | UNAVAILABLE
    assignment_type   VARCHAR(30) NOT NULL,
    -- SHIFT | OFF | LEAVE | UNAVAILABLE
    status            VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    -- DRAFT | CONFIRMED | PUBLISHED | CANCELLED
    source            VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
    -- SYSTEM (optimizer) | MANUAL (WFM override) | REPLACEMENT | ADJUSTMENT
    locked            BOOLEAN     NOT NULL DEFAULT FALSE,
    -- If true, optimizer must not change this assignment
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_roster_assignment UNIQUE (roster_version_id, employee_id, date)
);

CREATE INDEX idx_roster_assignments_version_id      ON roster_assignments(roster_version_id);
CREATE INDEX idx_roster_assignments_employee_id     ON roster_assignments(employee_id);
CREATE INDEX idx_roster_assignments_date            ON roster_assignments(date);
CREATE INDEX idx_roster_assignments_shift_id        ON roster_assignments(shift_id);
CREATE INDEX idx_roster_assignments_version_emp_date ON roster_assignments(roster_version_id, employee_id, date);
CREATE INDEX idx_roster_assignments_version_date_shift ON roster_assignments(roster_version_id, date, shift_id);
CREATE INDEX idx_roster_assignments_team_id         ON roster_assignments(team_id);
CREATE INDEX idx_roster_assignments_locked          ON roster_assignments(locked) WHERE locked = TRUE;
CREATE INDEX idx_roster_assignments_source          ON roster_assignments(source);
CREATE INDEX idx_roster_assignments_type            ON roster_assignments(assignment_type);

COMMENT ON TABLE roster_assignments IS
    'CENTRAL unified roster table for ALL roles. '
    'Associates, TLs, AMs, Managers, Senior Managers, WFM all stored here. '
    'Employee role determines the type of assignment. '
    'assignment_type: SHIFT (working) | OFF (weekly off) | LEAVE | UNAVAILABLE. '
    'source: SYSTEM (optimizer-generated) | MANUAL (WFM override) | REPLACEMENT | ADJUSTMENT. '
    'locked=TRUE: optimizer and automated processes must NOT modify this assignment.';


-- V15b: Roster locks table
CREATE TABLE roster_locks (
    id                    BIGSERIAL PRIMARY KEY,
    roster_assignment_id  BIGINT      NOT NULL REFERENCES roster_assignments(id),
    locked_by             BIGINT      NOT NULL REFERENCES employees(id),
    locked_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason                TEXT
);

CREATE INDEX idx_roster_locks_assignment_id ON roster_locks(roster_assignment_id);
CREATE INDEX idx_roster_locks_locked_by     ON roster_locks(locked_by);

COMMENT ON TABLE roster_locks IS
    'Lock records for roster assignments. '
    'WFM can lock individual assignments. Locked assignments are skipped by optimizer. '
    'UI must clearly show locked status.';
