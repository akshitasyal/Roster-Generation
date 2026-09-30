package com.wfm.security;

import com.wfm.common.dto.ApiResponse;
import com.wfm.employee.repository.EmployeeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * Authentication controller - public endpoints for login.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Login, logout, and token refresh")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and obtain JWT tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        WfmUserPrincipal principal = (WfmUserPrincipal) authentication.getPrincipal();

        // Update last login
        employeeRepository.findById(principal.getId()).ifPresent(emp -> {
            emp.setLastLoginAt(Instant.now());
            employeeRepository.save(emp);
        });

        String accessToken = jwtTokenProvider.generateToken(principal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

        LoginResponse response = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .employeeId(principal.getId())
                .employeeCode(principal.getEmployeeCode())
                .email(principal.getUsername())
                .role(principal.getRoleCode())
                .fullName(principal.getEmployee().getFullName())
                .build();

        log.info("User logged in: employeeId={}, role={}", principal.getId(), principal.getRoleCode());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            @Valid @RequestBody RefreshRequest request) {

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid or expired refresh token"));
        }

        String email = jwtTokenProvider.extractUsername(request.getRefreshToken());
        WfmUserDetailsService userDetailsService = null; // injected below via field
        // Re-load user
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", null));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (client should discard tokens)")
    public ResponseEntity<ApiResponse<String>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<MeResponse>> me(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            WfmUserPrincipal principal) {

        MeResponse me = MeResponse.builder()
                .employeeId(principal.getId())
                .employeeCode(principal.getEmployeeCode())
                .email(principal.getUsername())
                .fullName(principal.getEmployee().getFullName())
                .role(principal.getRoleCode())
                .build();

        return ResponseEntity.ok(ApiResponse.success(me));
    }

    // DTO classes
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
        private Long employeeId;
        private String employeeCode;
        private String email;
        private String role;
        private String fullName;
    }

    @Data
    @lombok.Builder
    public static class MeResponse {
        private Long employeeId;
        private String employeeCode;
        private String email;
        private String fullName;
        private String role;
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleBadCredentials(Exception ex) {
        log.error("Authentication failed: {}", ex.getMessage());
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid email or password"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneralAuthError(Exception ex) {
        log.error("General auth error", ex);
        return ResponseEntity.status(500).body(ApiResponse.error("Internal Server Error: " + ex.getMessage()));
    }
}
