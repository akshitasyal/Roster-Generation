package com.wfm.skill.service;
import com.wfm.skill.dto.SkillDTO;
import java.util.List;
public interface SkillService {
    SkillDTO getSkillById(Long id);
    List<SkillDTO> getAllSkills();
    SkillDTO createSkill(SkillDTO dto);
    SkillDTO updateSkill(Long id, SkillDTO dto);
}
