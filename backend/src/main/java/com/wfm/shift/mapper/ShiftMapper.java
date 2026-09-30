package com.wfm.shift.mapper;
import com.wfm.shift.dto.ShiftDTO;
import com.wfm.shift.entity.Shift;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ShiftMapper {
    ShiftDTO toDto(Shift entity);
    Shift toEntity(ShiftDTO dto);
}
