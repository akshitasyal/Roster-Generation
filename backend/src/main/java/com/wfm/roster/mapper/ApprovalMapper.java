package com.wfm.roster.mapper;
import com.wfm.roster.dto.ApprovalDTO;
import com.wfm.roster.entity.Approval;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApprovalMapper {
    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "approverId", source = "approver.id")
    ApprovalDTO toDto(Approval entity);
}
