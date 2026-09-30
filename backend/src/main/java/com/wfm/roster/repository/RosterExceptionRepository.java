package com.wfm.roster.repository;
import com.wfm.roster.entity.RosterException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface RosterExceptionRepository extends JpaRepository<RosterException, Long> {
    List<RosterException> findByRosterVersionId(Long rosterVersionId);
}
