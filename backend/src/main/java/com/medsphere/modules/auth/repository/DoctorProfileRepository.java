package com.medsphere.modules.auth.repository;

import com.medsphere.modules.auth.entity.DoctorProfile;
import com.medsphere.modules.auth.enums.VerificationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import com.medsphere.modules.auth.enums.VerificationStatus;
import java.util.List;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, UUID> {
    Optional<DoctorProfile> findByUserId(UUID userId);
    List<DoctorProfile> findByVerificationStatus(VerificationStatus status);
}