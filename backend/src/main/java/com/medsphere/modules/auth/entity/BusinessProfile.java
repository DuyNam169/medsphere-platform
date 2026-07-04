package com.medsphere.modules.auth.entity;

import com.medsphere.core.entity.BaseEntity;
import com.medsphere.modules.auth.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 255)
    private String businessName;

    @Column(length = 50)
    private String taxCode;

    @Column(length = 255)
    private String headquartersAddress;

    @Column(length = 512)
    private String licenseImageUrl;

    @Column(length = 500)
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
}