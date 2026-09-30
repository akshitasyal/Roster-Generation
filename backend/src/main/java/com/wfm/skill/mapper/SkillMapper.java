package com.wfm.skill.mapper;
import com.wfm.skill.dto.SkillDTO;
import com.wfm.skill.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SkillMapper {
    SkillDTO toDto(Skill entity);
    Skill toEntity(SkillDTO dto);
}
