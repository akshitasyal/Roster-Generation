package com.wfm.skill.dto;
import lombok.Data;
@Data
public class SkillDTO {
    private Long id;
    private String skillCode;
    private String skillName;
    private String description;
    private String category;
    private String status;
}
