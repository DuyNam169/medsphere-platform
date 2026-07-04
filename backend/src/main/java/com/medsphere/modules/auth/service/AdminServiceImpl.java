package com.medsphere.modules.auth.service;

import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import com.medsphere.modules.auth.dto.AdminDtos;
import com.medsphere.modules.auth.entity.BusinessProfile;
import com.medsphere.modules.auth.entity.DoctorProfile;
import com.medsphere.modules.auth.enums.VerificationStatus;
import com.medsphere.modules.auth.repository.BusinessProfileRepository;
import com.medsphere.modules.auth.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final DoctorProfileRepository   doctorProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminDtos.PendingDoctorSummary> getPendingDoctors() {
        return doctorProfileRepository.findByVerificationStatus(VerificationStatus.PENDING)
                .stream()
                .map(this::toDoctorSummary)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminDtos.PendingBusinessSummary> getPendingBusinesses() {
        return businessProfileRepository.findByVerificationStatus(VerificationStatus.PENDING)
                .stream()
                .map(this::toBusinessSummary)
                .toList();
    }

    @Override
    @Transactional
    public void decideDoctorVerification(UUID doctorProfileId, AdminDtos.VerificationDecisionRequest request) {
        validateDecisionStatus(request.getStatus());

        DoctorProfile profile = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));

        profile.setVerificationStatus(request.getStatus());
        profile.setRejectionReason(
                request.getStatus() == VerificationStatus.REJECTED ? request.getRejectionReason() : null
        );
        doctorProfileRepository.save(profile);

        log.info("Doctor profile {} verification set to {}", doctorProfileId, request.getStatus());
    }

    @Override
    @Transactional
    public void decideBusinessVerification(UUID businessProfileId, AdminDtos.VerificationDecisionRequest request) {
        validateDecisionStatus(request.getStatus());

        BusinessProfile profile = businessProfileRepository.findById(businessProfileId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));

        profile.setVerificationStatus(request.getStatus());
        profile.setRejectionReason(
                request.getStatus() == VerificationStatus.REJECTED ? request.getRejectionReason() : null
        );
        businessProfileRepository.save(profile);

        log.info("Business profile {} verification set to {}", businessProfileId, request.getStatus());
    }

    // ── Helpers ───────────────────────────────────────────────

    private void validateDecisionStatus(VerificationStatus status) {
        if (status != VerificationStatus.APPROVED && status != VerificationStatus.REJECTED) {
            throw new AppException(ErrorCode.INVALID_VERIFICATION_STATUS);
        }
    }

    private AdminDtos.PendingDoctorSummary toDoctorSummary(DoctorProfile p) {
        return new AdminDtos.PendingDoctorSummary(
                p.getId(),
                p.getUser().getId(),
                p.getUser().getFullName(),
                p.getUser().getEmail(),
                p.getUser().getPhone(),
                p.getSpecialty(),
                p.getWorkplace(),
                p.getYearsOfExperience(),
                p.getLicenseNumber(),
                p.getLicenseImageUrl(),
                p.getVerificationStatus(),
                p.getCreatedAt()
        );
    }

    private AdminDtos.PendingBusinessSummary toBusinessSummary(BusinessProfile p) {
        return new AdminDtos.PendingBusinessSummary(
                p.getId(),
                p.getUser().getId(),
                p.getUser().getFullName(),
                p.getUser().getEmail(),
                p.getUser().getPhone(),
                p.getBusinessName(),
                p.getTaxCode(),
                p.getHeadquartersAddress(),
                p.getLicenseImageUrl(),
                p.getVerificationStatus(),
                p.getCreatedAt()
        );
    }
}