-- V20: Create generation_runs table
CREATE TABLE generation_runs (
    id                BIGSERIAL PRIMARY KEY,
    planning_cycle_id BIGINT       NOT NULL REFERENCES planning_cycles(id),
    roster_version_id BIGINT       REFERENCES roster_versions(id),
    scope             VARCHAR(50)  NOT NULL DEFAULT 'FULL_WEEK',
    -- FULL_WEEK | SINGLE_DAY | SPECIFIC_SHIFT | SPECIFIC_TEAM | SPECIFIC_TL | STAFFING_GAP | REPLACEMENT
    algorithm_name    VARCHAR(100) NOT NULL DEFAULT 'CP_SAT_ROSTER_V1',
    algorithm_version VARCHAR(50),
    solver_name       VARCHAR(100) NOT NULL DEFAULT 'OR_TOOLS_CP_SAT',
    started_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at      TIMESTAMPTZ,
    status            VARCHAR(30)  NOT NULL DEFAULT 'RUNNING',
    -- RUNNING | COMPLETED | FAILED | TIMED_OUT | CANCELLED
    objective_value   DECIMAL(15,4),
    -- Final objective function value
    hard_violations   INTEGER      DEFAULT 0,
    coverage_gap      INTEGER      DEFAULT 0,
    -- Total uncovered headcount
    execution_time_ms BIGINT,
    solver_status     VARCHAR(50),
    -- OPTIMAL | FEASIBLE | INFEASIBLE | UNKNOWN | TIMEOUT
    error_message     TEXT,
    run_params        JSONB,
    -- Stores the parameters used for this run (weights, limits, etc.)
    created_by        BIGINT       REFERENCES employees(id)
);

CREATE INDEX idx_generation_runs_cycle_id   ON generation_runs(planning_cycle_id);
CREATE INDEX idx_generation_runs_version_id ON generation_runs(roster_version_id);
CREATE INDEX idx_generation_runs_status     ON generation_runs(status);
CREATE INDEX idx_generation_runs_started_at ON generation_runs(started_at);

COMMENT ON TABLE generation_runs IS
    'Audit trail for every optimization run. Critical for production debugging. '
    'Every generation should have a run record. '
    'solver_status: OPTIMAL | FEASIBLE | INFEASIBLE | UNKNOWN | TIMEOUT. '
    'Correlated with generation run ID (GR-YYYY-NNN) in logs.';
