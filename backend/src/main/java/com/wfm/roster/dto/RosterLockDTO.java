package com.wfm.roster.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class RosterLockDTO {
    private Long id;
    private Long rosterAssignmentId;
    private Long lockedById;
    private Instant lockedAt;
    private String reason;
}
