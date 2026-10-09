-- V30.1: Create missing management_coverage_requirements table

CREATE TABLE management_coverage_requirements (
    id             BIGSERIAL PRIMARY KEY,
    project_id     BIGINT NOT NULL REFERENCES projects(id),
    role_id        BIGINT NOT NULL REFERENCES roles(id),
    shift_id       BIGINT NOT NULL REFERENCES shifts(id),
    min_required   INT NOT NULL DEFAULT 1,
    effective_from DATE NOT NULL,
    effective_to   DATE,
    
    CONSTRAINT uq_mgmt_cov_req UNIQUE (project_id, role_id, shift_id, effective_from)
);
