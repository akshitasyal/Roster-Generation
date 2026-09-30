package com.wfm.skill.service;
import com.wfm.skill.dto.SkillDTO;
import com.wfm.skill.entity.Skill;
import com.wfm.skill.mapper.SkillMapper;
import com.wfm.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {
    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;
    @Override
    public SkillDTO getSkillById(Long id) {
        return skillRepository.findById(id).map(skillMapper::toDto).orElseThrow();
    }
    @Override
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream().map(skillMapper::toDto).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public SkillDTO createSkill(SkillDTO dto) {
        return skillMapper.toDto(skillRepository.save(skillMapper.toEntity(dto)));
    }
    @Override
    @Transactional
    public SkillDTO updateSkill(Long id, SkillDTO dto) {
        Skill existing = skillRepository.findById(id).orElseThrow();
        existing.setSkillName(dto.getSkillName());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setStatus(dto.getStatus());
        return skillMapper.toDto(skillRepository.save(existing));
    }
}
