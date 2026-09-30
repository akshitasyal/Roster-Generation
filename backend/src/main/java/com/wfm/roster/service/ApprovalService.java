package com.wfm.roster.service;
import com.wfm.roster.dto.ApprovalDTO;
import java.util.List;
public interface ApprovalService {
    ApprovalDTO requestApproval(Long versionId, String level, Long approverId);
    ApprovalDTO approve(Long approvalId, Long approverId, String comments);
    ApprovalDTO reject(Long approvalId, Long approverId, String comments);
    void publishRoster(Long versionId, Long publisherId);
    List<ApprovalDTO> getApprovals(Long versionId);
}
