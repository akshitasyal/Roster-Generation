package com.wfm.security;

import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.security.entity.UserAccount;
import com.wfm.security.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security UserDetailsService.
 *
 * <p>Load flow on every authentication request:
 * <ol>
 *   <li>Find UserAccount by email (auth layer)</li>
 *   <li>Find linked Employee by emp_id (org identity)</li>
 *   <li>Verify employee.status = Active (employment eligibility)</li>
 *   <li>Resolve portal role via PortalRoleResolver (designation + skill → WFM/MANAGER/etc.)</li>
 *   <li>Construct WfmUserPrincipal wrapping both</li>
 * </ol>
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WfmUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;
    private final EmployeeRepository employeeRepository;
    private final PortalRoleResolver portalRoleResolver;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = email.toLowerCase().trim();

        // 1. Find the authentication account
        UserAccount account = userAccountRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No account found for email: " + normalizedEmail));

        // 2. Load the linked employee record (source of truth)
        Employee employee = employeeRepository.findByEmpId(account.getEmpId())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Employee record not found for emp_id: " + account.getEmpId()));

        // 3. Check employment eligibility (employees.status is the authoritative source)
        if (!"Active".equalsIgnoreCase(employee.getStatus())) {
            throw new UsernameNotFoundException(
                    "Employee account is not active: " + normalizedEmail);
        }

        // 4. Derive portal role from designation + skill (never from stored/user value)
        String portalRole = portalRoleResolver.resolve(employee);

        log.debug("Loaded user: empId={}, designation={}, skill={}, portalRole={}",
                employee.getEmpId(), employee.getDesignation(), employee.getSkill(), portalRole);

        return new WfmUserPrincipal(employee, account, portalRole);
    }
}
