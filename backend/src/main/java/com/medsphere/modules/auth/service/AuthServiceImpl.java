package com.medsphere.modules.auth.service;

import com.medsphere.core.config.JwtConfig;
import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import com.medsphere.core.security.JwtUtil;
import com.medsphere.modules.auth.dto.AuthDtos;
import com.medsphere.modules.auth.entity.User;
import com.medsphere.modules.auth.enums.AuthProvider;
import com.medsphere.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtUtil               jwtUtil;
    private final JwtConfig             jwtConfig;
    private final StringRedisTemplate   redisTemplate;
    private final GoogleTokenVerifier   googleTokenVerifier;

    private static final String BLACKLIST_PREFIX = "auth:refresh:blacklist:";

    // ── Email / password login ────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!user.isEnabled())         throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        if (!user.isAccountNonLocked()) throw new AppException(ErrorCode.ACCOUNT_LOCKED);

        // Google-only accounts have no password
        if (user.getProvider() == AuthProvider.GOOGLE || user.getPasswordHash() == null) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        return buildAuthResponse(user);
    }

    // ── Register ──────────────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);
        log.info("Registered new user: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Google OAuth login ────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse googleLogin(AuthDtos.GoogleAuthRequest request) {
        // 1. Verify id_token with Google — throws if invalid
        GoogleTokenVerifier.GoogleUserInfo info =
                googleTokenVerifier.verify(request.getIdToken());

        // 2. Find or create user
        User user = userRepository.findByEmail(info.email())
                .map(existing -> {
                    // If user registered locally, link the Google account
                    if (existing.getProvider() == AuthProvider.LOCAL) {
                        existing.setGoogleId(info.googleId());
                        // Don't change provider — keep LOCAL so password login still works
                    }
                    // Refresh avatar from Google
                    if (info.avatarUrl() != null) {
                        existing.setAvatarUrl(info.avatarUrl());
                    }
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    // Brand new user via Google
                    User newUser = User.builder()
                            .email(info.email())
                            .fullName(info.fullName())
                            .avatarUrl(info.avatarUrl())
                            .googleId(info.googleId())
                            .provider(AuthProvider.GOOGLE)
                            // No passwordHash — Google users can't use email login
                            .build();
                    log.info("New user via Google: {}", info.email());
                    return userRepository.save(newUser);
                });

        if (!user.isEnabled())          throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        if (!user.isAccountNonLocked()) throw new AppException(ErrorCode.ACCOUNT_LOCKED);

        return buildAuthResponse(user);
    }

    // ── Refresh token ─────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AuthDtos.TokenResponse refreshToken(AuthDtos.RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        if (!jwtUtil.isRefreshToken(token)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }
        if (isBlacklisted(token)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        User user = userRepository
                .findById(UUID.fromString(jwtUtil.extractUserId(token)))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String newAccess = jwtUtil.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return AuthDtos.TokenResponse.builder()
                .accessToken(newAccess)
                .expiresIn(jwtConfig.getAccessTokenExpiryMs() / 1000)
                .build();
    }

    // ── Logout ────────────────────────────────────────────────

    @Override
    public void logout(String refreshToken) {
        try {
            jwtUtil.extractAllClaims(refreshToken);
            blacklist(refreshToken);
        } catch (AppException ex) {
            log.debug("Logout with invalid/expired token: {}", ex.getMessage());
        }
    }

    // ── Helpers ───────────────────────────────────────────────

    private AuthDtos.AuthResponse buildAuthResponse(User user) {
        String access  = jwtUtil.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refresh = jwtUtil.generateRefreshToken(user.getId());

        return AuthDtos.AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .expiresIn(jwtConfig.getAccessTokenExpiryMs() / 1000)
                .user(AuthDtos.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .avatarUrl(user.getAvatarUrl())
                        .role(user.getRole())
                        .provider(user.getProvider().name())
                        .build())
                .build();
    }

    private void blacklist(String token) {
        redisTemplate.opsForValue().set(
                BLACKLIST_PREFIX + token,
                "1",
                Duration.ofMillis(jwtUtil.getRefreshTokenExpiryMs())
        );
    }

    private boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
    }
}