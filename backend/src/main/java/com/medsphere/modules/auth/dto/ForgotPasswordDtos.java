package com.medsphere.modules.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public final class ForgotPasswordDtos {
    private ForgotPasswordDtos() {}

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class RequestOtpRequest {
        @NotBlank @Email(message = "Invalid email format")
        private String email;
    }

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class VerifyOtpRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6, max = 6, message = "OTP must be 6 digits")
        private String otp;
    }

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class ResetPasswordRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6, max = 6)
        private String otp;
        @NotBlank
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,128}$",
            message = "Password must be 8-128 characters and include uppercase, lowercase, number and special character"
        )
        private String newPassword;
    }
}