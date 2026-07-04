package com.medsphere.modules.auth.entity;

import com.medsphere.core.entity.BaseEntity;
import com.medsphere.modules.auth.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "doctor_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String specialty;

    @Column(length = 255)
    private String workplace;

    private Integer yearsOfExperience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private BigDecimal consultationFee;

    @Column(length = 50)
    private String licenseNumber;

    @Column(length = 512)
    private String licenseImageUrl;

    @Column(length = 500)
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
}