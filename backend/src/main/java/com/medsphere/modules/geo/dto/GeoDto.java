package com.medsphere.modules.geo.dto;

public final class GeoDto {
    private GeoDto() {}

    public record LanguageResponse(String countryCode, String language) {}
}