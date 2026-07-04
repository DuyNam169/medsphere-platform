package com.medsphere.modules.auth.controller;

import com.medsphere.core.response.ApiResponse;
import com.medsphere.modules.auth.dto.AdminDtos;
import com.medsphere.modules.auth.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/doctors/pending")
    public ApiResponse<List<AdminDtos.PendingDoctorSummary>> getPendingDoctors() {
        return ApiResponse.success(adminService.getPendingDoctors());
    }

    @GetMapping("/businesses/pending")
    public ApiResponse<List<AdminDtos.PendingBusinessSummary>> getPendingBusinesses() {
        return ApiResponse.success(adminService.getPendingBusinesses());
    }

    @PostMapping("/doctors/{doctorProfileId}/verify")
    public ApiResponse<Void> verifyDoctor(
            @PathVariable UUID doctorProfileId,
            @Valid @RequestBody AdminDtos.VerificationDecisionRequest request) {
        adminService.decideDoctorVerification(doctorProfileId, request);
        return ApiResponse.success();
    }

    @PostMapping("/businesses/{businessProfileId}/verify")
    public ApiResponse<Void> verifyBusiness(
            @PathVariable UUID businessProfileId,
            @Valid @RequestBody AdminDtos.VerificationDecisionRequest request) {
        adminService.decideBusinessVerification(businessProfileId, request);
        return ApiResponse.success();
    }
}