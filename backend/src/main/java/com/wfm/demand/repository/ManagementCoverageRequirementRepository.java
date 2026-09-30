package com.wfm.demand.repository;

import com.wfm.demand.entity.ManagementCoverageRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagementCoverageRequirementRepository extends JpaRepository<ManagementCoverageRequirement, Long> {
}
