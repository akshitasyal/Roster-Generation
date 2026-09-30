package com.wfm.roster.service;
import com.wfm.roster.dto.RosterAdjustmentDTO;
import com.wfm.roster.dto.RosterLockDTO;
import java.util.List;
public interface RosterAdjustmentService {
    RosterAdjustmentDTO applyAdjustment(RosterAdjustmentDTO dto);
    RosterLockDTO lockAssignment(Long assignmentId, Long lockedById, String reason);
    void unlockAssignment(Long assignmentId);
    Long createNewVersion(Long oldVersionId, String newVersionType, Long generatedById, String notes);
    List<RosterAdjustmentDTO> getAdjustments(Long versionId);
}
