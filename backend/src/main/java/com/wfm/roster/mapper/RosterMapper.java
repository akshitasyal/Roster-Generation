package com.wfm.roster.mapper;
import com.wfm.roster.dto.*;
import com.wfm.roster.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RosterMapper {
    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.name")
    @Mapping(target = "employeeCode", source = "employee.empId")
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "teamId", source = "team.id")
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "shiftCode", source = "shift.shiftCode")
    RosterAssignmentDTO toAssignmentDto(RosterAssignment entity);

    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "roleId", source = "role.id")
    CoverageDTO toCoverageDto(Coverage entity);

    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "resolvedById", source = "resolvedBy.id")
    RosterExceptionDTO toExceptionDto(RosterException entity);

    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "parentVersionId", source = "parentVersion.id")
    @Mapping(target = "generatedById", source = "generatedBy.id")
    @Mapping(target = "approvedById", source = "approvedBy.id")
    @Mapping(target = "publishedById", source = "publishedBy.id")
    RosterVersionDTO toVersionDto(RosterVersion entity);
}
