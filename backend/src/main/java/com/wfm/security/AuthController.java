package com.wfm.security;

import com.wfm.common.dto.ApiResponse;
import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.security.entity.UserAccount;
import com.wfm.security.repository.UserAccountRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Authentication controller.
 *
 * <p>Register flow:
 * email → check employees table → check status → check no existing account
 * → hash password → create user_account → done.
 *
 * Login flow:
 * email → load user_account + employee → verify status → verify password
 * → derive portal role from designation+skill → issue JWT.
 *
 * NEVER trusts role or designation from the request.
 */
@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Signup, login, logout, token refresh")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserAccountRepository userAccountRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final PortalRoleResolver portalRoleResolver;

    // ======================================================================
    // POST /api/auth/register  — Account Activation (Signup)
    // ======================================================================

    @PostMapping("/register")
    @Operation(summary = "Activate employee account using registered corporate email")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request) {

        String email = request.getEmail().toLowerCase().trim();

        // STEP 1: Verify email exists in the employee master
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
        if (employeeOpt.isEmpty()) {
            log.warn("Signup attempt for unknown email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("IDENTITY_NOT_FOUND: Employee identity not found. " +
                            "Please use your registered Tech Mahindra email address."));
        }

        Employee employee = employeeOpt.get();

        // STEP 2: Check employment eligibility (employees.status must be Active)
        if (!"Active".equalsIgnoreCase(employee.getStatus())) {
            log.warn("Signup attempt for inactive employee: {}", employee.getEmpId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("ACCOUNT_NOT_ELIGIBLE: Your employee account is not " +
                            "currently eligible for access."));
        }

        // STEP 3: Check if account already exists
        if (userAccountRepository.existsByEmpId(employee.getEmpId())) {
            log.warn("Duplicate signup attempt for emp: {}", employee.getEmpId());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("ACCOUNT_ALREADY_REGISTERED: An account already exists " +
                            "for this employee. Please sign in or use Forgot Password."));
        }

        // STEP 4: Validate and hash password
        UserAccount account = UserAccount.builder()
                .empId(employee.getEmpId())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .accountStatus("ACTIVE")
                .emailVerified(true)
                .failedLoginAttempts(0)
                .build();

        userAccountRepository.save(account);

        log.info("Account created: empId={}, designation={}", employee.getEmpId(), employee.getDesignation());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account activated successfully. You can now sign in.", null));
    }

    // ======================================================================
    // POST /api/auth/login
    // ======================================================================

    @PostMapping("/login")
    @Operation(summary = "Authenticate employee and obtain JWT tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        WfmUserPrincipal principal = (WfmUserPrincipal) authentication.getPrincipal();

        // Update last login timestamp
        UserAccount account = principal.getUserAccount();
        account.setLastLoginAt(Instant.now());
        account.setFailedLoginAttempts(0);
        userAccountRepository.save(account);

        String accessToken  = jwtTokenProvider.generateToken(principal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

        Employee emp = principal.getEmployee();

        LoginResponse response = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .empId(emp.getEmpId())
                .email(principal.getUsername())
                .fullName(emp.getFullName())
                .designation(emp.getDesignation())
                .portalRole(principal.getRoleCode())
                .build();

        log.info("Login success: empId={}, designation={}, portalRole={}",
                emp.getEmpId(), emp.getDesignation(), principal.getRoleCode());

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    // ======================================================================
    // GET /api/auth/me  — Full employee context (authoritative)
    // ======================================================================

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's full employee context")
    public ResponseEntity<ApiResponse<MeResponse>> me(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            WfmUserPrincipal principal) {

        Employee emp = principal.getEmployee();
        String portalRole = principal.getRoleCode();

        MeResponse me = MeResponse.builder()
                .empId(emp.getEmpId())
                .name(emp.getFullName())
                .email(principal.getUsername())
                .designation(emp.getDesignation())
                .portalRole(portalRole)
                .empType(emp.getEmpType())
                .status(emp.getStatus())
                .lob(emp.getLob())
                .channel(emp.getChannel())
                .skill(emp.getSkill())
                .agentStatus(emp.getAgentStatus())
                .modeOfWork(emp.getModeOfWork())
                .location(emp.getLocation())
                .center(emp.getCenter())
                .country(emp.getCountry())
                .manager1EmpId(emp.getManager1EmpId())
                .manager1Name(emp.getManager1Name())
                .manager2EmpId(emp.getManager2EmpId())
                .manager2Name(emp.getManager2Name())
                .manager3EmpId(emp.getManager3EmpId())
                .manager3Name(emp.getManager3Name())
                .manager4EmpId(emp.getManager4EmpId())
                .manager4Name(emp.getManager4Name())
                .permissions(portalRoleResolver.getPermissions(portalRole))
                .build();

        return ResponseEntity.ok(ApiResponse.success(me));
    }

    // ======================================================================
    // POST /api/auth/logout
    // ======================================================================

    @PostMapping("/logout")
    @Operation(summary = "Logout (client must discard tokens)")
    public ResponseEntity<ApiResponse<String>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    // ======================================================================
    // POST /api/auth/refresh
    // ======================================================================

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<String>> refresh(@Valid @RequestBody RefreshRequest request) {
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid or expired refresh token"));
        }
        return ResponseEntity.ok(ApiResponse.success("Use /login to obtain a new token", null));
    }

    // ======================================================================
    // Exception handlers
    // ======================================================================

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleBadCredentials(Exception ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid email or password"));
    }

    @ExceptionHandler(org.springframework.security.authentication.DisabledException.class)
    public ResponseEntity<ApiResponse<String>> handleDisabled(Exception ex) {
        return ResponseEntity.status(403).body(ApiResponse.error(
                "LOGIN_DENIED: Your employee account is not currently active."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneralError(Exception ex) {
        log.error("Auth error", ex);
        return ResponseEntity.status(500).body(ApiResponse.error("Internal Server Error: " + ex.getMessage()));
    }

    // ======================================================================
    // Request / Response DTOs
    // ======================================================================

    @Data
    public static class RegisterRequest {
        @Email @NotBlank
        private String email;

        @NotBlank @Size(min = 8, max = 100,
                message = "Password must be 8–100 characters")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }

    @Data
    @lombok.Builder
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private String empId;
        private String email;
        private String fullName;
        private String designation;
        /** Portal role code derived server-side. Never from frontend. */
        private String portalRole;
    }

    @Data
    @lombok.Builder
    public static class MeResponse {
        // Core identity
        private String empId;
        private String name;
        private String email;
        private String designation;
        private String portalRole;
        // Employment
        private String empType;
        private String status;
        // Org data
        private String lob;
        private String channel;
        private String skill;
        private String agentStatus;
        private String modeOfWork;
        private String location;
        private String center;
        private String country;
        // Manager hierarchy (from employee master)
        private String manager1EmpId;
        private String manager1Name;
        private String manager2EmpId;
        private String manager2Name;
        private String manager3EmpId;
        private String manager3Name;
        private String manager4EmpId;
        private String manager4Name;
        // Permissions
        private List<String> permissions;
    }
}
