package com.medsphere.modules.auth.repository;

import com.medsphere.modules.auth.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import com.medsphere.modules.auth.enums.VerificationStatus;
import java.util.List;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, UUID> {
    Optional<BusinessProfile> findByUserId(UUID userId);
    List<BusinessProfile> findByVerificationStatus(VerificationStatus status);
}