package com.medsphere.modules.geo.controller;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.response.ApiResponse;
import com.medsphere.modules.geo.dto.GeoDto;
import com.medsphere.modules.geo.service.GeoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.medsphere.core.web.RequestIpUtils;

@RestController
@RequestMapping(AppConstants.GEO_BASE)
@RequiredArgsConstructor
public class GeoController {

    private final GeoService geoService;

    @GetMapping("/language")
    public ApiResponse<GeoDto.LanguageResponse> detectLanguage(HttpServletRequest request) {
        String clientIp = RequestIpUtils.extractClientIp(request);
        return ApiResponse.success(geoService.detectLanguage(clientIp));
    }
}