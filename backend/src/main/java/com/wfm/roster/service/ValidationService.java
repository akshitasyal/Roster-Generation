package com.wfm.roster.service;
import com.wfm.roster.dto.RosterExceptionDTO;
import java.util.List;
public interface ValidationService {
    List<RosterExceptionDTO> validateRosterVersion(Long rosterVersionId);
}
