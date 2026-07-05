package com.medsphere.modules.auth.service;

import com.medsphere.modules.auth.dto.AuthDtos;

import java.util.UUID;

public interface AuthService {
    AuthDtos.AuthResponse  login(AuthDtos.LoginRequest request, String clientIp, String userAgent, String language);
    AuthDtos.AuthResponse  register(AuthDtos.RegisterRequest request, String language);
    AuthDtos.AuthResponse  registerDoctor(AuthDtos.DoctorRegisterRequest request, String language);
    AuthDtos.AuthResponse  registerBusiness(AuthDtos.BusinessRegisterRequest request, String language);
    AuthDtos.AuthResponse  googleLogin(AuthDtos.GoogleAuthRequest request);
    AuthDtos.TokenResponse refreshToken(AuthDtos.RefreshTokenRequest request);
    void                   logout(String refreshToken);
    AuthDtos.AuthResponse  upgradeToPatient(UUID userId, AuthDtos.PatientUpgradeRequest request);
    void requestPasswordResetOtp(com.medsphere.modules.auth.dto.ForgotPasswordDtos.RequestOtpRequest request, String language);
    void verifyPasswordResetOtp(com.medsphere.modules.auth.dto.ForgotPasswordDtos.VerifyOtpRequest request);
    void resetPassword(com.medsphere.modules.auth.dto.ForgotPasswordDtos.ResetPasswordRequest request, String clientIp, String language);
    void logoutAllDevices(String securityActionToken);
}