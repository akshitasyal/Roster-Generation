package com.wfm.leave.service;
import com.wfm.leave.dto.LeaveDTO;
import java.util.List;
public interface LeaveService {
    List<LeaveDTO> getLeavesByEmployee(Long employeeId);
    LeaveDTO submitLeave(LeaveDTO dto);
    LeaveDTO approveLeave(Long leaveId, Long approverId);
}
