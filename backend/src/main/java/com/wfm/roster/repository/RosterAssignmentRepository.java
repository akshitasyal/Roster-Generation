package com.wfm.roster.repository;
import com.wfm.roster.entity.RosterAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface RosterAssignmentRepository extends JpaRepository<RosterAssignment, Long> {
    List<RosterAssignment> findByRosterVersionId(Long rosterVersionId);
    List<RosterAssignment> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
}
