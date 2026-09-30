package com.wfm.preference.service;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import com.wfm.preference.entity.EmployeePreference;
import com.wfm.preference.entity.WeeklyOffPreference;
import com.wfm.preference.mapper.PreferenceMapper;
import com.wfm.preference.repository.EmployeePreferenceRepository;
import com.wfm.preference.repository.WeeklyOffPreferenceRepository;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PreferenceServiceImpl implements PreferenceService {
    private final EmployeePreferenceRepository empPrefRepo;
    private final WeeklyOffPreferenceRepository weeklyPrefRepo;
    private final EmployeeRepository empRepo;
    private final PlanningCycleRepository cycleRepo;
    private final ShiftRepository shiftRepo;
    private final PreferenceMapper mapper;

    @Override
    public List<EmployeePreferenceDTO> getEmployeePreferences(Long cycleId, Long employeeId) {
        return empPrefRepo.findAll().stream()
            .filter(p -> p.getPlanningCycle().getId().equals(cycleId) && p.getEmployee().getId().equals(employeeId))
            .map(mapper::toEmployeePrefDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeePreferenceDTO submitEmployeePreference(EmployeePreferenceDTO dto) {
        EmployeePreference entity = mapper.toEmployeePrefEntity(dto);
        entity.setEmployee(empRepo.findById(dto.getEmployeeId()).orElseThrow());
        entity.setPlanningCycle(cycleRepo.findById(dto.getPlanningCycleId()).orElseThrow());
        entity.setPreferredShift(shiftRepo.findById(dto.getPreferredShiftId()).orElseThrow());
        return mapper.toEmployeePrefDto(empPrefRepo.save(entity));
    }

    @Override
    @Transactional
    public EmployeePreferenceDTO declineEmployeePreference(Long prefId, Long tlId, String reason) {
        EmployeePreference entity = empPrefRepo.findById(prefId).orElseThrow();
        entity.setTlDeclined(true);
        entity.setTlDeclineReason(reason);
        entity.setTlDeclinedBy(empRepo.findById(tlId).orElseThrow());
        entity.setTlDeclinedAt(Instant.now());
        return mapper.toEmployeePrefDto(empPrefRepo.save(entity));
    }

    @Override
    public List<WeeklyOffPreferenceDTO> getWeeklyOffPreferences(Long cycleId, Long employeeId) {
        return weeklyPrefRepo.findAll().stream()
            .filter(p -> p.getPlanningCycle().getId().equals(cycleId) && p.getEmployee().getId().equals(employeeId))
            .map(mapper::toWeeklyOffPrefDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WeeklyOffPreferenceDTO submitWeeklyOffPreference(WeeklyOffPreferenceDTO dto) {
        WeeklyOffPreference entity = mapper.toWeeklyOffPrefEntity(dto);
        entity.setEmployee(empRepo.findById(dto.getEmployeeId()).orElseThrow());
        entity.setPlanningCycle(cycleRepo.findById(dto.getPlanningCycleId()).orElseThrow());
        return mapper.toWeeklyOffPrefDto(weeklyPrefRepo.save(entity));
    }
}
