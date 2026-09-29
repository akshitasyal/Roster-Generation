-- V10: Create planning_cycles table
CREATE TABLE planning_cycles (
    id                      BIGSERIAL PRIMARY KEY,
    project_id              BIGINT      NOT NULL REFERENCES projects(id),
    cycle_name              VARCHAR(200) NOT NULL,
    start_date              DATE         NOT NULL,
    end_date                DATE         NOT NULL,
    status                  VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
    -- DRAFT | PREFERENCE_OPEN | PREFERENCE_LOCKED | GENERATING | GENERATED | VALIDATED | APPROVED | PUBLISHED | CLOSED
    preference_open_at      TIMESTAMPTZ,
    preference_lock_at      TIMESTAMPTZ,
    tl_review_open_at       TIMESTAMPTZ,
    tl_review_close_at      TIMESTAMPTZ,
    generation_started_at   TIMESTAMPTZ,
    generation_completed_at TIMESTAMPTZ,
    created_by              BIGINT       REFERENCES employees(id),
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_cycle_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_planning_cycles_project_id ON planning_cycles(project_id);
CREATE INDEX idx_planning_cycles_status     ON planning_cycles(status);
CREATE INDEX idx_planning_cycles_dates      ON planning_cycles(start_date, end_date);

COMMENT ON TABLE planning_cycles IS
    'Weekly planning cycles. Typical cycle: Monday-Sunday. '
    'Status flow: DRAFT -> PREFERENCE_OPEN -> PREFERENCE_LOCKED -> GENERATING -> GENERATED -> VALIDATED -> APPROVED -> PUBLISHED -> CLOSED. '
    'Preference window and TL review deadlines are configurable per cycle.';
