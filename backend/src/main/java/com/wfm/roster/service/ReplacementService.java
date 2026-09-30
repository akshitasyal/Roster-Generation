package com.wfm.roster.service;
import com.wfm.roster.dto.ReplacementCandidateDTO;
import com.wfm.roster.dto.RosterAssignmentDTO;
import java.util.List;
public interface ReplacementService {
    List<ReplacementCandidateDTO> findEligibleReplacements(Long assignmentId);
    RosterAssignmentDTO executeReplacement(Long assignmentId, Long replacementEmployeeId, Long wfmId, String reason);
}
