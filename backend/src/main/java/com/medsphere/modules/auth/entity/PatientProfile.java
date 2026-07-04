package com.medsphere.modules.auth.entity;

import com.medsphere.core.entity.BaseEntity;
import com.medsphere.modules.auth.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(length = 100)
    private String province;

    @Column(length = 255)
    private String addressDetail;

    @Column(length = 10)
    private String bloodType;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;
}