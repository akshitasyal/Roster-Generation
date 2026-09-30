package com.wfm.roster.repository;
import com.wfm.roster.entity.RosterLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface RosterLockRepository extends JpaRepository<RosterLock, Long> {
    Optional<RosterLock> findByRosterAssignmentId(Long assignmentId);
}
