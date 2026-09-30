package com.wfm.leave.service;
import com.wfm.leave.dto.LeaveDTO;
import com.wfm.leave.entity.Leave;
import com.wfm.leave.mapper.LeaveMapper;
import com.wfm.leave.repository.LeaveRepository;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveMapper leaveMapper;
    
    @Override
    public List<LeaveDTO> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findAll().stream()
                .filter(l -> l.getEmployee().getId().equals(employeeId))
                .map(leaveMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LeaveDTO submitLeave(LeaveDTO dto) {
        Leave leave = leaveMapper.toEntity(dto);
        leave.setEmployee(employeeRepository.findById(dto.getEmployeeId()).orElseThrow());
        leave.setStatus("PENDING");
        return leaveMapper.toDto(leaveRepository.save(leave));
    }
    
    @Override
    @Transactional
    public LeaveDTO approveLeave(Long leaveId, Long approverId) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow();
        leave.setStatus("APPROVED");
        leave.setApprovedBy(employeeRepository.findById(approverId).orElseThrow());
        leave.setApprovedAt(Instant.now());
        return leaveMapper.toDto(leaveRepository.save(leave));
    }
}
