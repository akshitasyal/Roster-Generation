package com.wfm.employee.mapper;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper {
    @Mapping(target = "employeeCode", source = "empId")
    @Mapping(target = "firstName", source = "name")
    @Mapping(target = "dateOfJoining", source = "joiningDate")
    @Mapping(target = "employmentStatus", source = "status")
    @Mapping(target = "isActive", expression = "java(\"Active\".equalsIgnoreCase(entity.getStatus()))")
    EmployeeDTO toDto(Employee entity);

    Employee toEntity(EmployeeDTO dto);
}
