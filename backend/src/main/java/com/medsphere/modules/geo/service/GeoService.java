package com.medsphere.modules.geo.service;

import com.medsphere.modules.geo.dto.GeoDto;

public interface GeoService {
    GeoDto.LanguageResponse detectLanguage(String clientIp);
}