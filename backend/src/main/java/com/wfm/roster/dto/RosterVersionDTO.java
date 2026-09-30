package com.wfm.roster.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class RosterVersionDTO {
    private Long id;
    private Long planningCycleId;
    private Integer versionNumber;
    private String versionType;
    private String status;
    private Long parentVersionId;
    private String scope;
    private Long generatedById;
    private Instant generatedAt;
    private Long approvedById;
    private Instant approvedAt;
    private Long publishedById;
    private Instant publishedAt;
    private String versionNotes;
}
