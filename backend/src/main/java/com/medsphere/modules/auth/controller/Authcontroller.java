package com.medsphere.modules.auth.controller;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.response.ApiResponse;
import com.medsphere.modules.auth.dto.AuthDtos;
import com.medsphere.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(AppConstants.AUTH_BASE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @PostMapping("/register/doctor")
    public ApiResponse<AuthDtos.AuthResponse> registerDoctor(
            @Valid @RequestBody AuthDtos.DoctorRegisterRequest request) {
        return ApiResponse.success(authService.registerDoctor(request));
    }

    @PostMapping("/register/business")
    public ApiResponse<AuthDtos.AuthResponse> registerBusiness(
            @Valid @RequestBody AuthDtos.BusinessRegisterRequest request) {
        return ApiResponse.success(authService.registerBusiness(request));
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

    @PostMapping("/upgrade-patient")
    public ApiResponse<AuthDtos.AuthResponse> upgradeToPatient(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AuthDtos.PatientUpgradeRequest request) {
        return ApiResponse.success(
                authService.upgradeToPatient(UUID.fromString(userId), request));
    }
}