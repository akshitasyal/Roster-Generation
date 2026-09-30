package com.wfm.shift.repository;

import com.wfm.shift.entity.ShiftIntervalCoverage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftIntervalCoverageRepository extends JpaRepository<ShiftIntervalCoverage, Long> {
}
