package com.wfm.preference.mapper;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import com.wfm.preference.entity.EmployeePreference;
import com.wfm.preference.entity.WeeklyOffPreference;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PreferenceMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "preferredShiftId", source = "preferredShift.id")
    @Mapping(target = "tlDeclinedById", source = "tlDeclinedBy.id")
    EmployeePreferenceDTO toEmployeePrefDto(EmployeePreference entity);
    
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "planningCycle", ignore = true)
    @Mapping(target = "preferredShift", ignore = true)
    @Mapping(target = "tlDeclinedBy", ignore = true)
    EmployeePreference toEmployeePrefEntity(EmployeePreferenceDTO dto);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    WeeklyOffPreferenceDTO toWeeklyOffPrefDto(WeeklyOffPreference entity);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "planningCycle", ignore = true)
    WeeklyOffPreference toWeeklyOffPrefEntity(WeeklyOffPreferenceDTO dto);
}
