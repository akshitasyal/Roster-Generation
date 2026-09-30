package com.wfm.leave.mapper;
import com.wfm.leave.dto.LeaveDTO;
import com.wfm.leave.entity.Leave;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeaveMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "approvedById", source = "approvedBy.id")
    LeaveDTO toDto(Leave entity);
    
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "approvedBy", ignore = true)
    Leave toEntity(LeaveDTO dto);
}
