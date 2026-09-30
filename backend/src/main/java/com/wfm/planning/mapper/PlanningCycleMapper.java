package com.wfm.planning.mapper;
import com.wfm.planning.dto.PlanningCycleDTO;
import com.wfm.planning.entity.PlanningCycle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PlanningCycleMapper {
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "createdById", source = "createdBy.id")
    PlanningCycleDTO toDto(PlanningCycle entity);
    
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    PlanningCycle toEntity(PlanningCycleDTO dto);
}
