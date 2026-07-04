package com.medsphere.modules.auth.service;

import com.medsphere.modules.auth.dto.AuthDtos;

import java.util.UUID;

public interface AuthService {
    AuthDtos.AuthResponse  login(AuthDtos.LoginRequest request);
    AuthDtos.AuthResponse  register(AuthDtos.RegisterRequest request);
    AuthDtos.AuthResponse  registerDoctor(AuthDtos.DoctorRegisterRequest request);
    AuthDtos.AuthResponse  registerBusiness(AuthDtos.BusinessRegisterRequest request);
    AuthDtos.AuthResponse  googleLogin(AuthDtos.GoogleAuthRequest request);
    AuthDtos.TokenResponse refreshToken(AuthDtos.RefreshTokenRequest request);
    void                   logout(String refreshToken);
    AuthDtos.AuthResponse  upgradeToPatient(UUID userId, AuthDtos.PatientUpgradeRequest request);
}