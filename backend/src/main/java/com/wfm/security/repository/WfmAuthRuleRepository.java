package com.wfm.security.repository;

import com.wfm.security.entity.WfmAuthRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WfmAuthRuleRepository extends JpaRepository<WfmAuthRule, Long> {

    /** Returns all active rules ordered by priority (lowest first). */
    List<WfmAuthRule> findByActiveTrueOrderByPriorityAsc();
}
