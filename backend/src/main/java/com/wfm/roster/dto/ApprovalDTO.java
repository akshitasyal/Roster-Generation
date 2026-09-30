package com.wfm.roster.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class ApprovalDTO {
    private Long id;
    private Long rosterVersionId;
    private String approvalLevel;
    private Long approverId;
    private String status;
    private String comments;
    private Instant approvedAt;
}
