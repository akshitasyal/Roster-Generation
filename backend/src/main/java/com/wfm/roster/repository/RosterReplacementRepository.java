package com.wfm.roster.repository;

import com.wfm.roster.entity.RosterReplacement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RosterReplacementRepository extends JpaRepository<RosterReplacement, Long> {

    List<RosterReplacement> findByOriginalAssignmentId(Long assignmentId);

    List<RosterReplacement> findByOriginalEmployeeIdAndDate(Long employeeId, LocalDate date);

    List<RosterReplacement> findByReplacementStatus(String status);
}
