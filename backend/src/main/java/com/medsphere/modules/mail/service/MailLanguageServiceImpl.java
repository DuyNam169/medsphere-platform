package com.medsphere.modules.mail.service;

import com.medsphere.modules.geo.dto.GeoDto;
import com.medsphere.modules.geo.service.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailLanguageServiceImpl implements MailLanguageService {

    private final GeoService geoService;

    @Override
    public String resolveLanguageFromIp(String clientIp) {
        GeoDto.LanguageResponse response = geoService.detectLanguage(clientIp);
        return response.language();
    }
}