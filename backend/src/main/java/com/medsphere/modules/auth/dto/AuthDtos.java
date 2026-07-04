package com.medsphere.modules.auth.dto;

import com.medsphere.modules.auth.enums.Gender;
import com.medsphere.modules.auth.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}

    // ── Login ──────────────────────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required") @Size(max = 255)
        private String email;
        @NotBlank(message = "Password is required") @Size(min = 6, max = 128)
        private String password;
        private boolean rememberMe;
    }

    // ── Register: USER (vãng lai) ────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required") @Size(max = 100)
        private String fullName;
        @NotBlank @Email(message = "Invalid email") @Size(max = 255)
        private String email;
        @NotBlank @Size(min = 8, max = 128, message = "Password must be 8-128 chars")
        private String password;
        @Pattern(regexp = "^(\\+?[0-9]{9,15})?$", message = "Invalid phone")
        private String phone;
    }

    // ── Register: DOCTOR ──────────────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class DoctorRegisterRequest {
        @NotBlank(message = "Full name is required") @Size(max = 100)
        private String fullName;
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Invalid phone")
        private String phone;
        @NotBlank @Email(message = "Invalid email") @Size(max = 255)
        private String email;
        @NotBlank @Size(min = 8, max = 128, message = "Password must be 8-128 chars")
        private String password;

        @NotBlank(message = "Specialty is required") @Size(max = 100)
        private String specialty;
        @NotBlank(message = "Workplace is required") @Size(max = 255)
        private String workplace;
        @NotNull(message = "Years of experience is required")
        @Min(0)
        private Integer yearsOfExperience;
        @Size(max = 2000)
        private String bio;
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal consultationFee;

        @NotBlank(message = "License number is required") @Size(max = 50)
        private String licenseNumber;
        @NotBlank(message = "License image is required")
        private String licenseImageUrl;
    }

    // ── Register: BUSINESS ────────────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class BusinessRegisterRequest {
        @NotBlank(message = "Contact name is required") @Size(max = 100)
        private String contactName;
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Invalid phone")
        private String phone;
        @NotBlank @Email(message = "Invalid email") @Size(max = 255)
        private String email;
        @NotBlank @Size(min = 8, max = 128, message = "Password must be 8-128 chars")
        private String password;

        @NotBlank(message = "Business name is required") @Size(max = 255)
        private String businessName;
        @NotBlank(message = "Tax code is required") @Size(max = 50)
        private String taxCode;
        @NotBlank(message = "Headquarters address is required") @Size(max = 255)
        private String headquartersAddress;
        @NotBlank(message = "License image is required")
        private String licenseImageUrl;
    }

    // ── Upgrade USER -> PATIENT ───────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class PatientUpgradeRequest {
        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        private LocalDate dateOfBirth;
        @NotNull(message = "Gender is required")
        private Gender gender;
        @NotBlank(message = "Province is required") @Size(max = 100)
        private String province;
        @Size(max = 255)
        private String addressDetail;
        @Size(max = 10)
        private String bloodType;
        @Size(max = 5000)
        private String medicalHistory;
    }

    // ── Refresh / Google / Logout ─────────────────────────────

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class RefreshTokenRequest {
        @NotBlank(message = "Refresh token is required")
        private String refreshToken;
    }

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class GoogleAuthRequest {
        @NotBlank(message = "Google id_token is required")
        private String idToken;
    }

    // ── Responses ──────────────────────────────────────────────

    @Getter @Builder @AllArgsConstructor
    public static class AuthResponse {
        private String   accessToken;
        private String   refreshToken;
        private long     expiresIn;
        private UserInfo user;
    }

    @Getter @Builder @AllArgsConstructor
    public static class UserInfo {
        private UUID   id;
        private String email;
        private String fullName;
        private String avatarUrl;
        private Role   role;
        private String provider;
    }

    @Getter @Builder @AllArgsConstructor
    public static class TokenResponse {
        private String accessToken;
        private long   expiresIn;
    }
}