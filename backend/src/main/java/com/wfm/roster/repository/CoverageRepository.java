package com.wfm.roster.repository;
import com.wfm.roster.entity.Coverage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CoverageRepository extends JpaRepository<Coverage, Long> {
    List<Coverage> findByRosterVersionId(Long rosterVersionId);
}
