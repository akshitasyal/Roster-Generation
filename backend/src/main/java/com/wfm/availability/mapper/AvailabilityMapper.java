package com.wfm.availability.mapper;
import com.wfm.availability.dto.AvailabilityDTO;
import com.wfm.availability.entity.Availability;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AvailabilityMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    AvailabilityDTO toDto(Availability entity);
    
    @Mapping(target = "employee", ignore = true)
    Availability toEntity(AvailabilityDTO dto);
}
