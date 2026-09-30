package com.wfm.roster.repository;
import com.wfm.roster.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByRosterVersionId(Long versionId);
}
