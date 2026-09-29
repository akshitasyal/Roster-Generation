-- V11: Create preferences tables
-- Employee shift preferences per planning cycle
CREATE TABLE employee_preferences (
    id                BIGSERIAL PRIMARY KEY,
    employee_id       BIGINT      NOT NULL REFERENCES employees(id),
    planning_cycle_id BIGINT      NOT NULL REFERENCES planning_cycles(id),
    preferred_shift_id BIGINT     NOT NULL REFERENCES shifts(id),
    preference_rank   INTEGER     NOT NULL DEFAULT 1,
    -- 1 = most preferred
    tl_declined       BOOLEAN     NOT NULL DEFAULT FALSE,
    tl_declined_by    BIGINT      REFERENCES employees(id),
    tl_declined_at    TIMESTAMPTZ,
    tl_decline_reason TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_employee_pref_cycle_rank UNIQUE (employee_id, planning_cycle_id, preference_rank)
);

CREATE INDEX idx_emp_pref_employee_id       ON employee_preferences(employee_id);
CREATE INDEX idx_emp_pref_planning_cycle_id ON employee_preferences(planning_cycle_id);
CREATE INDEX idx_emp_pref_shift_id          ON employee_preferences(preferred_shift_id);

COMMENT ON TABLE employee_preferences IS
    'Employee shift preferences per planning cycle. preference_rank: 1=most preferred. '
    'TL can DECLINE (not approve) a preference before deadline. '
    'Preferences are SOFT constraints (S1, S8) - honored where possible, not mandatory.';


-- Employee weekly-off preferences per planning cycle
CREATE TABLE weekly_off_preferences (
    id                BIGSERIAL PRIMARY KEY,
    employee_id       BIGINT      NOT NULL REFERENCES employees(id),
    planning_cycle_id BIGINT      NOT NULL REFERENCES planning_cycles(id),
    day_of_week       VARCHAR(10) NOT NULL,
    -- MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY | SATURDAY | SUNDAY
    preference_rank   INTEGER     NOT NULL DEFAULT 1,
    -- 1 = most preferred off day
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_weekly_off_pref UNIQUE (employee_id, planning_cycle_id, day_of_week)
);

CREATE INDEX idx_weekly_off_pref_employee_id ON weekly_off_preferences(employee_id);
CREATE INDEX idx_weekly_off_pref_cycle_id    ON weekly_off_preferences(planning_cycle_id);

COMMENT ON TABLE weekly_off_preferences IS
    'Employee weekly-off day preferences per planning cycle. '
    'Employee receives exactly 2 OFF days per week (configurable). '
    'The two OFF days do NOT have to be consecutive. '
    'Weekly-off preference is SOFT constraint (S5).';
