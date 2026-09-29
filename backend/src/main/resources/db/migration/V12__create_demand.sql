-- V12: Create demand_configurations and demand tables

-- Demand formula configuration (pluggable, not hard-coded)
CREATE TABLE demand_configurations (
    id               BIGSERIAL PRIMARY KEY,
    project_id       BIGINT         NOT NULL REFERENCES projects(id),
    name             VARCHAR(200)   NOT NULL,
    formula_type     VARCHAR(50)    NOT NULL DEFAULT 'ERLANG_C',
    -- ERLANG_C | SIMPLE_HEADCOUNT | CUSTOM
    -- Formula parameters (may vary by formula_type)
    aht              DECIMAL(10,2),
    -- Average Handle Time (seconds or minutes, as configured)
    shrinkage        DECIMAL(5,4),
    -- e.g. 0.25 = 25% shrinkage
    occupancy        DECIMAL(5,4),
    -- e.g. 0.85 = 85% occupancy target
    utilization      DECIMAL(5,4),
    -- e.g. 0.90 = 90% utilization
    service_level    DECIMAL(5,4),
    -- e.g. 0.80 = 80% service level target
    interval_minutes INTEGER        NOT NULL DEFAULT 30,
    -- demand interval in minutes
    formula_params   JSONB,
    -- extensible: store additional formula-specific params
    effective_from   DATE           NOT NULL,
    effective_to     DATE,
    is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_demand_config_project_id ON demand_configurations(project_id);
CREATE INDEX idx_demand_config_active     ON demand_configurations(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE demand_configurations IS
    'Pluggable demand formula configuration. formula_type determines which formula to use. '
    'Parameters like AHT, shrinkage, occupancy, utilization are configurable. '
    'Do NOT hard-code demand calculation logic.';


-- Actual demand data per planning cycle
CREATE TABLE demand (
    id                BIGSERIAL PRIMARY KEY,
    planning_cycle_id BIGINT      NOT NULL REFERENCES planning_cycles(id),
    project_id        BIGINT      NOT NULL REFERENCES projects(id),
    date              DATE        NOT NULL,
    interval_start    TIME        NOT NULL,
    interval_end      TIME        NOT NULL,
    shift_id          BIGINT      REFERENCES shifts(id),
    skill_id          BIGINT      REFERENCES skills(id),
    role_id           BIGINT      REFERENCES roles(id),
    required_headcount INTEGER    NOT NULL DEFAULT 0,
    source            VARCHAR(30) NOT NULL DEFAULT 'MANUAL',
    -- MANUAL | CALCULATED | IMPORTED | FORECAST
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_demand_planning_cycle_id   ON demand(planning_cycle_id);
CREATE INDEX idx_demand_project_id          ON demand(project_id);
CREATE INDEX idx_demand_date                ON demand(date);
CREATE INDEX idx_demand_cycle_date_interval ON demand(planning_cycle_id, date, interval_start);
CREATE INDEX idx_demand_project_date        ON demand(project_id, date);
CREATE INDEX idx_demand_role_id             ON demand(role_id);
CREATE INDEX idx_demand_skill_id            ON demand(skill_id);

COMMENT ON TABLE demand IS
    'Demand per planning cycle, date, interval, shift, skill, role. '
    'Supports both ASSOCIATE demand (role=ASSOCIATE, skill=TECHNICAL_SUPPORT) '
    'and MANAGEMENT COVERAGE demand (role=TL, skill=NULL). '
    'required_headcount=0 is allowed (no demand for that interval).';
