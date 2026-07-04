package com.medsphere.modules.auth.dto;

import com.medsphere.modules.auth.enums.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

public final class AdminDtos {
    private AdminDtos() {}

    @Getter @NoArgsConstructor @AllArgsConstructor
    public static class VerificationDecisionRequest {
        @NotNull(message = "Status is required")
        private VerificationStatus status; // APPROVED hoặc REJECTED

        @Size(max = 500)
        private String rejectionReason; // Lý do từ chối (optional, chỉ dùng khi REJECTED)
    }

    @Getter @AllArgsConstructor
    public static class PendingDoctorSummary {
        private UUID id;
        private UUID userId;
        private String fullName;
        private String email;
        private String phone;
        private String specialty;
        private String workplace;
        private Integer yearsOfExperience;
        private String licenseNumber;
        private String licenseImageUrl;
        private VerificationStatus verificationStatus;
        private Instant createdAt;
    }

    @Getter @AllArgsConstructor
    public static class PendingBusinessSummary {
        private UUID id;
        private UUID userId;
        private String contactName;
        private String email;
        private String phone;
        private String businessName;
        private String taxCode;
        private String headquartersAddress;
        private String licenseImageUrl;
        private VerificationStatus verificationStatus;
        private Instant createdAt;
    }
}