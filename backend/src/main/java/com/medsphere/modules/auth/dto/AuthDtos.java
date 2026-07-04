package com.medsphere.modules.auth.dto;

import com.medsphere.modules.auth.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required") @Size(max = 255)
        private String email;
        @NotBlank(message = "Password is required") @Size(min = 6, max = 128)
        private String password;
        private boolean rememberMe;
    }

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required") @Size(max = 100)
        private String fullName;
        @NotBlank @Email(message = "Invalid email") @Size(max = 255)
        private String email;
        @NotBlank @Size(min = 8, max = 128, message = "Password must be 8–128 chars")
        private String password;
        @Pattern(regexp = "^(\\+?[0-9]{9,15})?$", message = "Invalid phone")
        private String phone;
    }

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