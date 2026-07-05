package com.medsphere.modules.auth.controller;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.response.ApiResponse;
import com.medsphere.modules.auth.dto.AuthDtos;
import com.medsphere.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.medsphere.core.web.RequestIpUtils;
import com.medsphere.modules.auth.dto.ForgotPasswordDtos;
import com.medsphere.modules.mail.service.MailLanguageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.UUID;

@RestController
@RequestMapping(AppConstants.AUTH_BASE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MailLanguageService mailLanguageService;

    @PostMapping("/login")
    public ApiResponse<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        return ApiResponse.success(authService.login(request, clientIp, userAgent, language));
    }

    @PostMapping("/register")
    public ApiResponse<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        return ApiResponse.success(authService.register(request, language));
    }

   @PostMapping("/register/doctor")
    public ApiResponse<AuthDtos.AuthResponse> registerDoctor(
            @Valid @RequestBody AuthDtos.DoctorRegisterRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        return ApiResponse.success(authService.registerDoctor(request, language));
    }

    @PostMapping("/register/business")
    public ApiResponse<AuthDtos.AuthResponse> registerBusiness(
            @Valid @RequestBody AuthDtos.BusinessRegisterRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        return ApiResponse.success(authService.registerBusiness(request, language));
    }

    @PostMapping("/google-login")
    public ApiResponse<AuthDtos.AuthResponse> googleLogin(
            @Valid @RequestBody AuthDtos.GoogleAuthRequest request) {
        return ApiResponse.success(authService.googleLogin(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthDtos.TokenResponse> refresh(
            @Valid @RequestBody AuthDtos.RefreshTokenRequest request) {
        return ApiResponse.success(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @Valid @RequestBody AuthDtos.RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ApiResponse.success(null);
    }

    @PostMapping("/forgot-password/request-otp")
    public ApiResponse<Void> requestOtp(
            @Valid @RequestBody ForgotPasswordDtos.RequestOtpRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        authService.requestPasswordResetOtp(request, language);
        return ApiResponse.success();
    }

    @PostMapping("/forgot-password/verify-otp")
    public ApiResponse<Void> verifyOtp(
            @Valid @RequestBody ForgotPasswordDtos.VerifyOtpRequest request) {
        authService.verifyPasswordResetOtp(request);
        return ApiResponse.success();
    }

    @PostMapping("/forgot-password/reset")
    public ApiResponse<Void> resetPassword(
            @Valid @RequestBody ForgotPasswordDtos.ResetPasswordRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = RequestIpUtils.extractClientIp(httpRequest);
        String language = mailLanguageService.resolveLanguageFromIp(clientIp);
        authService.resetPassword(request, clientIp, language);
        return ApiResponse.success();
    }

    @PostMapping("/upgrade-patient")
    public ApiResponse<AuthDtos.AuthResponse> upgradeToPatient(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AuthDtos.PatientUpgradeRequest request) {
        return ApiResponse.success(
                authService.upgradeToPatient(UUID.fromString(userId), request));
    }

    @PostMapping("/security/logout-all-devices")
    public ApiResponse<Void> logoutAllDevices(
            @RequestBody java.util.Map<String, String> body) {
        String token = body.get("token");
        authService.logoutAllDevices(token);
        return ApiResponse.success();
    }
}