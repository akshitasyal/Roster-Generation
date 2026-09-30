package com.wfm.demand.mapper;
import com.wfm.demand.dto.DemandDTO;
import com.wfm.demand.entity.Demand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DemandMapper {
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "roleId", source = "role.id")
    DemandDTO toDto(Demand entity);
    
    @Mapping(target = "planningCycle", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "shift", ignore = true)
    @Mapping(target = "skill", ignore = true)
    @Mapping(target = "role", ignore = true)
    Demand toEntity(DemandDTO dto);
}
