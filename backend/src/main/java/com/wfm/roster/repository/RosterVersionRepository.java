package com.wfm.roster.repository;
import com.wfm.roster.entity.RosterVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface RosterVersionRepository extends JpaRepository<RosterVersion, Long> {
    List<RosterVersion> findByPlanningCycleId(Long cycleId);
}
