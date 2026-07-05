package com.medsphere.core.security;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.exception.AppException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String TOKEN_VALID_AFTER_PREFIX = "auth:token-valid-after:";

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest  request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain         filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (!jwtUtil.isAccessToken(token)) {
                    log.debug("Refresh token used for API access — rejected");
                } else {
                    String userId = jwtUtil.extractUserId(token);
                    String role   = jwtUtil.extractRole(token);
                    long issuedAtMillis = jwtUtil.extractIssuedAt(token).getTime();

                    if (isInvalidatedAfterIssue(userId, issuedAtMillis)) {
                        log.debug("Token for user {} was invalidated via logout-all-devices", userId);
                    } else {
                        var auth = new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (AppException ex) {
                log.debug("JWT validation failed: {}", ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isInvalidatedAfterIssue(String userId, long issuedAtMillis) {
        String validAfterStr = redisTemplate.opsForValue().get(TOKEN_VALID_AFTER_PREFIX + userId);
        if (validAfterStr == null) return false;
        try {
            long validAfterMillis = Long.parseLong(validAfterStr);
            return issuedAtMillis < validAfterMillis;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(AppConstants.AUTH_HEADER);
        if (StringUtils.hasText(header) && header.startsWith(AppConstants.BEARER_PREFIX)) {
            return header.substring(AppConstants.BEARER_PREFIX.length());
        }
        return null;
    }
}