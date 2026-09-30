package com.wfm.roster.mapper;
import com.wfm.roster.dto.RosterAdjustmentDTO;
import com.wfm.roster.dto.RosterLockDTO;
import com.wfm.roster.entity.RosterAdjustment;
import com.wfm.roster.entity.RosterLock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdjustmentMapper {
    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "rosterAssignmentId", source = "rosterAssignment.id")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "oldShiftId", source = "oldShift.id")
    @Mapping(target = "newShiftId", source = "newShift.id")
    @Mapping(target = "requestedById", source = "requestedBy.id")
    @Mapping(target = "approvedById", source = "approvedBy.id")
    RosterAdjustmentDTO toAdjustmentDto(RosterAdjustment entity);

    @Mapping(target = "rosterAssignmentId", source = "rosterAssignment.id")
    @Mapping(target = "lockedById", source = "lockedBy.id")
    RosterLockDTO toLockDto(RosterLock entity);
}
