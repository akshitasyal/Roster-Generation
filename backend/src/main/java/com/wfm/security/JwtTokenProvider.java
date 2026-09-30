package com.wfm.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT token provider for authentication.
 * Handles token generation, validation, and claims extraction.
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${wfm.security.jwt.secret}")
    private String jwtSecret;

    @Value("${wfm.security.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${wfm.security.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT access token for an authenticated user.
     */
    public String generateToken(WfmUserPrincipal userPrincipal) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userPrincipal.getId());
        claims.put("employeeCode", userPrincipal.getEmployeeCode());
        claims.put("role", userPrincipal.getRoleCode());
        claims.put("type", "ACCESS");
        return buildToken(claims, userPrincipal.getUsername(), jwtExpirationMs);
    }

    /**
     * Generate JWT refresh token.
     */
    public String generateRefreshToken(WfmUserPrincipal userPrincipal) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userPrincipal.getId());
        claims.put("type", "REFRESH");
        return buildToken(claims, userPrincipal.getUsername(), refreshExpirationMs);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expirationMs) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract username (email) from token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract employee ID from token claims.
     */
    public Long extractEmployeeId(String token) {
        Claims claims = extractAllClaims(token);
        return ((Number) claims.get("id")).longValue();
    }

    /**
     * Extract role code from token claims.
     */
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Validate token against user details.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Validate token structure and signature without UserDetails.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("JWT token is expired");
        } catch (UnsupportedJwtException e) {
            log.debug("JWT token is unsupported");
        } catch (MalformedJwtException e) {
            log.debug("JWT token is malformed");
        } catch (IllegalArgumentException e) {
            log.debug("JWT claims string is empty");
        }
        return false;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
