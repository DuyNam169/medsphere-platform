package com.medsphere.core.security;

import com.medsphere.core.config.JwtConfig;
import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtConfig jwtConfig;

    // ── Key ──────────────────────────────────────────────────

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ── Generate ─────────────────────────────────────────────

    /**
     * Generates a short-lived access token (15 min default).
     * Claims: sub=userId, email, roles
     */
    public String generateAccessToken(UUID userId, String email, String role) {
        return buildToken(
                Map.of("email", email, "role", role, "type", "access"),
                userId.toString(),
                jwtConfig.getAccessTokenExpiryMs()
        );
    }

    /**
     * Generates a long-lived refresh token (7 days default).
     * Minimal claims — only used to get a new access token.
     */
    public String generateRefreshToken(UUID userId) {
        return buildToken(
                Map.of("type", "refresh"),
                userId.toString(),
                jwtConfig.getRefreshTokenExpiryMs()
        );
    }

    private String buildToken(Map<String, Object> extraClaims,
                              String subject,
                              long expiryMs) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiryMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Parse ─────────────────────────────────────────────────

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException ex) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED, ex);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new AppException(ErrorCode.TOKEN_INVALID, ex);
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractEmail(String token) {
        return extractClaim(token, c -> c.get("email", String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, c -> c.get("role", String.class));
    }

    public String extractType(String token) {
        return extractClaim(token, c -> c.get("type", String.class));
    }

    // ── Validate ──────────────────────────────────────────────

    /**
     * Returns true if token is valid and not expired.
     * Throws AppException (TOKEN_EXPIRED / TOKEN_INVALID) otherwise.
     */
    public boolean isAccessToken(String token) {
        String type = extractType(token);
        return "access".equals(type);
    }

    public boolean isRefreshToken(String token) {
        String type = extractType(token);
        return "refresh".equals(type);
    }

    public long getRefreshTokenExpiryMs() {
        return jwtConfig.getRefreshTokenExpiryMs();
    }

    // ── Security action token (dùng cho link "not me" trong email) ──

    public String generateSecurityActionToken(UUID userId) {
        return buildToken(
                Map.of("type", "security_action"),
                userId.toString(),
                24 * 60 * 60 * 1000L // 24 giờ
        );
    }

    public boolean isSecurityActionToken(String token) {
        return "security_action".equals(extractType(token));
    }

    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }
}