package com.wfm.preference.service;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import java.util.List;
public interface PreferenceService {
    List<EmployeePreferenceDTO> getEmployeePreferences(Long cycleId, Long employeeId);
    EmployeePreferenceDTO submitEmployeePreference(EmployeePreferenceDTO dto);
    EmployeePreferenceDTO declineEmployeePreference(Long prefId, Long tlId, String reason);
    
    List<WeeklyOffPreferenceDTO> getWeeklyOffPreferences(Long cycleId, Long employeeId);
    WeeklyOffPreferenceDTO submitWeeklyOffPreference(WeeklyOffPreferenceDTO dto);
}
