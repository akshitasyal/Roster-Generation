package com.wfm.employee.mapper;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper {
    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleCode", source = "role.code")
    EmployeeDTO toDto(Employee entity);

    @Mapping(target = "role", ignore = true)
    Employee toEntity(EmployeeDTO dto);
}
