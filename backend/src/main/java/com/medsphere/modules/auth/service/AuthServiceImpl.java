package com.medsphere.modules.auth.service;

import com.medsphere.core.config.JwtConfig;
import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import com.medsphere.core.security.JwtUtil;
import com.medsphere.modules.auth.dto.AuthDtos;
import com.medsphere.modules.auth.entity.BusinessProfile;
import com.medsphere.modules.auth.entity.DoctorProfile;
import com.medsphere.modules.auth.entity.PatientProfile;
import com.medsphere.modules.auth.entity.User;
import com.medsphere.modules.auth.enums.AuthProvider;
import com.medsphere.modules.auth.enums.Role;
import com.medsphere.modules.auth.enums.VerificationStatus;
import com.medsphere.modules.auth.repository.BusinessProfileRepository;
import com.medsphere.modules.auth.repository.DoctorProfileRepository;
import com.medsphere.modules.auth.repository.PatientProfileRepository;
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

    private final UserRepository            userRepository;
    private final PatientProfileRepository  patientProfileRepository;
    private final DoctorProfileRepository   doctorProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final PasswordEncoder           passwordEncoder;
    private final JwtUtil                   jwtUtil;
    private final JwtConfig                 jwtConfig;
    private final StringRedisTemplate       redisTemplate;
    private final GoogleTokenVerifier       googleTokenVerifier;

    private static final String BLACKLIST_PREFIX = "auth:refresh:blacklist:";

    // ── Email / password login ────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!user.isEnabled())          throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        if (!user.isAccountNonLocked()) throw new AppException(ErrorCode.ACCOUNT_LOCKED);

        if (user.getProvider() == AuthProvider.GOOGLE || user.getPasswordHash() == null) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        return buildAuthResponse(user);
    }

    // ── Register: USER (vãng lai) ─────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.USER)
                .build();

        userRepository.save(user);
        log.info("Registered new USER: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Register: DOCTOR ───────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse registerDoctor(AuthDtos.DoctorRegisterRequest request) {
        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.DOCTOR)
                .build();
        user = userRepository.save(user);

        DoctorProfile profile = DoctorProfile.builder()
                .user(user)
                .specialty(request.getSpecialty())
                .workplace(request.getWorkplace())
                .yearsOfExperience(request.getYearsOfExperience())
                .bio(request.getBio())
                .consultationFee(request.getConsultationFee())
                .licenseNumber(request.getLicenseNumber())
                .licenseImageUrl(request.getLicenseImageUrl())
                .verificationStatus(VerificationStatus.PENDING)
                .build();
        doctorProfileRepository.save(profile);

        log.info("Registered new DOCTOR (pending approval): {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Register: BUSINESS ─────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse registerBusiness(AuthDtos.BusinessRegisterRequest request) {
        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getContactName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.BUSINESS)
                .build();
        user = userRepository.save(user);

        BusinessProfile profile = BusinessProfile.builder()
                .user(user)
                .businessName(request.getBusinessName())
                .taxCode(request.getTaxCode())
                .headquartersAddress(request.getHeadquartersAddress())
                .licenseImageUrl(request.getLicenseImageUrl())
                .verificationStatus(VerificationStatus.PENDING)
                .build();
        businessProfileRepository.save(profile);

        log.info("Registered new BUSINESS (pending approval): {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Upgrade USER -> PATIENT ─────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse upgradeToPatient(UUID userId, AuthDtos.PatientUpgradeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() != Role.USER && user.getRole() != Role.PATIENT) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        PatientProfile profile = patientProfileRepository.findByUserId(userId)
                .orElseGet(() -> PatientProfile.builder().user(user).build());

        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setProvince(request.getProvince());
        profile.setAddressDetail(request.getAddressDetail());
        profile.setBloodType(request.getBloodType());
        profile.setMedicalHistory(request.getMedicalHistory());
        patientProfileRepository.save(profile);

        if (user.getRole() == Role.USER) {
            user.setRole(Role.PATIENT);
            userRepository.save(user);
        }

        log.info("User upgraded to PATIENT: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Google OAuth login ────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse googleLogin(AuthDtos.GoogleAuthRequest request) {
        GoogleTokenVerifier.GoogleUserInfo info =
                googleTokenVerifier.verify(request.getIdToken());

        User user = userRepository.findByEmail(info.email())
                .map(existing -> {
                    if (existing.getProvider() == AuthProvider.LOCAL) {
                        existing.setGoogleId(info.googleId());
                    }
                    if (info.avatarUrl() != null) {
                        existing.setAvatarUrl(info.avatarUrl());
                    }
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(info.email())
                            .fullName(info.fullName())
                            .avatarUrl(info.avatarUrl())
                            .googleId(info.googleId())
                            .provider(AuthProvider.GOOGLE)
                            .role(Role.USER)
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

    private void validateEmailAndPhoneUnique(String email, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (phone != null && !phone.isBlank() && userRepository.existsByPhone(phone)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }
    }

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