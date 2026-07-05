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
import com.medsphere.modules.auth.dto.ForgotPasswordDtos;
import com.medsphere.modules.mail.service.MailService;
import com.medsphere.modules.mail.template.OtpResetPasswordEmailBuilder;
import com.medsphere.modules.mail.template.WelcomeEmailBuilder;
import com.medsphere.modules.mail.template.LoginNotificationEmailBuilder;
import com.medsphere.modules.mail.template.PasswordChangedEmailBuilder;
import java.time.Instant;

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
    private final MailService                    mailService;
    private final OtpResetPasswordEmailBuilder    otpEmailBuilder;
    private final WelcomeEmailBuilder             welcomeEmailBuilder;
    private final LoginNotificationEmailBuilder   loginNotificationEmailBuilder;
    private final PasswordChangedEmailBuilder     passwordChangedEmailBuilder;
    private static final String TOKEN_VALID_AFTER_PREFIX = "auth:token-valid-after:";

    private static final String BLACKLIST_PREFIX = "auth:refresh:blacklist:";
    private static final String   OTP_CODE_PREFIX     = "otp:code:";
    private static final String   OTP_VERIFIED_PREFIX  = "otp:verified:";
    private static final String   OTP_COOLDOWN_PREFIX  = "otp:cooldown:";
    private static final Duration OTP_TTL              = Duration.ofMinutes(5);
    private static final Duration OTP_VERIFIED_TTL      = Duration.ofMinutes(10);
    private static final Duration OTP_COOLDOWN_TTL      = Duration.ofSeconds(60);

    // ── Email / password login ────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(
            AuthDtos.LoginRequest request, String clientIp, String userAgent, String language) {
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

        String notMeUrl = buildSecurityActionUrl(user.getId());
        String effectiveLanguage = resolveEffectiveLanguage(user, language);
        var built = loginNotificationEmailBuilder.build(
                user.getFullName(), clientIp, userAgent, Instant.now(), notMeUrl, effectiveLanguage);
        mailService.sendHtml(user.getEmail(), built.subject(), built.html());

        return buildAuthResponse(user);
    }

    // ── Register: USER (vãng lai) ─────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request, String language) {
        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.USER)
                .preferredLanguage(language)
                .build();

        userRepository.save(user);
        log.info("Registered new USER: {}", user.getEmail());

        var built = welcomeEmailBuilder.build(user.getFullName(), user.getPreferredLanguage());
        mailService.sendHtml(user.getEmail(), built.subject(), built.html());

        return buildAuthResponse(user);
    }

    // ── Register: DOCTOR ───────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse registerDoctor(
            AuthDtos.DoctorRegisterRequest request,
            String language) {

        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.DOCTOR)
                .preferredLanguage(language)
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

        var built = welcomeEmailBuilder.build(user.getFullName(), user.getPreferredLanguage());
        mailService.sendHtml(user.getEmail(), built.subject(), built.html());

        return buildAuthResponse(user);
    }

    // ── Register: BUSINESS ─────────────────────────────────────

    @Override
    @Transactional
    public AuthDtos.AuthResponse registerBusiness(
            AuthDtos.BusinessRegisterRequest request,
            String language) {

        validateEmailAndPhoneUnique(request.getEmail(), request.getPhone());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getContactName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.BUSINESS)
                .preferredLanguage(language)
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

        var built = welcomeEmailBuilder.build(user.getFullName(), language);
        mailService.sendHtml(user.getEmail(), built.subject(), built.html());

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

        String userId = jwtUtil.extractUserId(token);
        long issuedAtMillis = jwtUtil.extractIssuedAt(token).getTime();
        if (isTokenInvalidated(userId, issuedAtMillis)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        User user = userRepository
                .findById(UUID.fromString(userId))
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

    /**
     * Ưu tiên ngôn ngữ đã lưu trong tài khoản (do user chọn hoặc detect lúc đăng ký).
     * Chỉ dùng ngôn ngữ detect theo IP tại thời điểm hiện tại làm phương án dự phòng
     * khi user chưa từng có preferredLanguage (ví dụ tài khoản tạo trước khi có tính năng này).
     */
    private String resolveEffectiveLanguage(User user, String ipDetectedLanguage) {
        return (user.getPreferredLanguage() != null && !user.getPreferredLanguage().isBlank())
                ? user.getPreferredLanguage()
                : ipDetectedLanguage;
    }

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

   // ── Forgot password (OTP via email) ────────────────────────

    @Override
    public void requestPasswordResetOtp(ForgotPasswordDtos.RequestOtpRequest request, String language) {
        String email = request.getEmail().trim().toLowerCase();

        if (Boolean.TRUE.equals(redisTemplate.hasKey(OTP_COOLDOWN_PREFIX + email))) {
            throw new AppException(ErrorCode.OTP_RESEND_TOO_SOON);
        }

        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            if (user.getProvider() == AuthProvider.GOOGLE) {
                log.info("Password reset requested for Google-only account: {}", email);
            } else {
                String otp = generateOtp();
                redisTemplate.opsForValue().set(OTP_CODE_PREFIX + email, otp, OTP_TTL);
                redisTemplate.opsForValue().set(OTP_COOLDOWN_PREFIX + email, "1", OTP_COOLDOWN_TTL);

                String effectiveLanguage = resolveEffectiveLanguage(user, language);
                var built = otpEmailBuilder.build(otp, effectiveLanguage);
                mailService.sendHtml(email, built.subject(), built.html());
            }
        }, () -> {
            redisTemplate.opsForValue().set(OTP_COOLDOWN_PREFIX + email, "1", OTP_COOLDOWN_TTL);
            log.debug("Password reset requested for non-existent email: {}", email);
        });
    }

    @Override
    public void verifyPasswordResetOtp(ForgotPasswordDtos.VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String storedOtp = redisTemplate.opsForValue().get(OTP_CODE_PREFIX + email);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
        if (!storedOtp.equals(request.getOtp())) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        redisTemplate.opsForValue().set(OTP_VERIFIED_PREFIX + email, "1", OTP_VERIFIED_TTL);
    }

    @Override
    @Transactional
    public void resetPassword(
            ForgotPasswordDtos.ResetPasswordRequest request, String clientIp, String language) {
        String email = request.getEmail().trim().toLowerCase();

        if (!Boolean.TRUE.equals(redisTemplate.hasKey(OTP_VERIFIED_PREFIX + email))) {
            throw new AppException(ErrorCode.OTP_NOT_VERIFIED);
        }

        String storedOtp = redisTemplate.opsForValue().get(OTP_CODE_PREFIX + email);
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getProvider() == AuthProvider.GOOGLE) {
            throw new AppException(ErrorCode.GOOGLE_ACCOUNT_NO_PASSWORD);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        redisTemplate.delete(OTP_CODE_PREFIX + email);
        redisTemplate.delete(OTP_VERIFIED_PREFIX + email);

        String notMeUrl = buildSecurityActionUrl(user.getId());
        String effectiveLanguage = resolveEffectiveLanguage(user, language);
        var built = passwordChangedEmailBuilder.build(
                user.getFullName(), clientIp, Instant.now(), notMeUrl, effectiveLanguage);
        mailService.sendHtml(user.getEmail(), built.subject(), built.html());

        log.info("Password reset successful for: {}", email);
    }

    // ── Logout everywhere (triggered from "not me" email link) ────

    @Override
    public void logoutAllDevices(String securityActionToken) {
        if (!jwtUtil.isSecurityActionToken(securityActionToken)) {
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }

        String userId = jwtUtil.extractUserId(securityActionToken);
        long nowMillis = System.currentTimeMillis();

        redisTemplate.opsForValue().set(
                TOKEN_VALID_AFTER_PREFIX + userId,
                String.valueOf(nowMillis),
                Duration.ofMillis(jwtConfig.getRefreshTokenExpiryMs())
        );

        log.info("User {} triggered logout-all-devices via security email link", userId);
    }

    /** Dùng bởi JwtAuthFilter để kiểm tra token có bị vô hiệu sau khi phát hành không. */
    public boolean isTokenInvalidated(String userId, long tokenIssuedAtMillis) {
        String validAfterStr = redisTemplate.opsForValue().get(TOKEN_VALID_AFTER_PREFIX + userId);
        if (validAfterStr == null) return false;
        long validAfterMillis = Long.parseLong(validAfterStr);
        return tokenIssuedAtMillis < validAfterMillis;
    }

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;

    private String buildSecurityActionUrl(UUID userId) {
        String token = jwtUtil.generateSecurityActionToken(userId);
        return frontendUrl + "/security/logout-all-devices?token=" + token;
    }

    private String generateOtp() {
        return String.valueOf(100000 + new java.util.Random().nextInt(900000));
    }
}