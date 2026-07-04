package com.medsphere.modules.auth.service;

import com.medsphere.modules.auth.dto.AdminDtos;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<AdminDtos.PendingDoctorSummary>   getPendingDoctors();
    List<AdminDtos.PendingBusinessSummary> getPendingBusinesses();
    void decideDoctorVerification(UUID doctorProfileId, AdminDtos.VerificationDecisionRequest request);
    void decideBusinessVerification(UUID businessProfileId, AdminDtos.VerificationDecisionRequest request);
}