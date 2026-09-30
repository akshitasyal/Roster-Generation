package com.wfm.roster.repository;
import com.wfm.roster.entity.RosterAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface RosterAdjustmentRepository extends JpaRepository<RosterAdjustment, Long> {
    List<RosterAdjustment> findByRosterVersionId(Long versionId);
}
