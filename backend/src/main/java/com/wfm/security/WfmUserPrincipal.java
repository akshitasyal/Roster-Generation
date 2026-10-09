package com.wfm.security;

import com.wfm.employee.entity.Employee;
import com.wfm.security.entity.UserAccount;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Custom Spring Security principal wrapping Employee + UserAccount.
 *
 * <p>The authority (portal role) is derived from the employee's designation
 * and skill via {@link PortalRoleResolver} — NEVER from a stored role field
 * or any user-submitted value.</p>
 */
@Getter
public class WfmUserPrincipal implements UserDetails {

    private final Employee employee;
    private final UserAccount userAccount;

    /** Pre-resolved portal role code (WFM | SENIOR_MANAGER | MANAGER | AM | TL | ASSOCIATE). */
    private final String portalRole;

    public WfmUserPrincipal(Employee employee, UserAccount userAccount, String portalRole) {
        this.employee = employee;
        this.userAccount = userAccount;
        this.portalRole = portalRole;
    }

    public Long getId() {
        return userAccount.getId();
    }

    public String getEmpId() {
        return employee.getEmpId();
    }

    /** @deprecated Use getEmpId() */
    public String getEmployeeCode() {
        return employee.getEmpId();
    }

    /** Returns the portal role code derived from designation+skill. */
    public String getRoleCode() {
        return portalRole;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(portalRole));
    }

    @Override
    public String getPassword() {
        return userAccount.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return userAccount.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Account is locked if user_accounts.account_status = LOCKED or employee.status = Inactive
        if (!"ACTIVE".equalsIgnoreCase(userAccount.getAccountStatus())) return false;
        if (userAccount.getLockedUntil() != null &&
                userAccount.getLockedUntil().isAfter(java.time.Instant.now())) return false;
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Both employee.status AND user_account.account_status must be active
        return "Active".equalsIgnoreCase(employee.getStatus())
                && "ACTIVE".equalsIgnoreCase(userAccount.getAccountStatus());
    }
}
