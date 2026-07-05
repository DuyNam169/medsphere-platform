package com.medsphere.modules.geo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medsphere.modules.geo.dto.GeoDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.medsphere.core.geo.CountryLanguageMapper;
import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {

    private final CountryLanguageMapper countryLanguageMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GeoDto.LanguageResponse detectLanguage(String clientIp) {
        if (clientIp == null || isPrivateOrLocalIp(clientIp)) {
            log.debug("Skip geo lookup for private/local IP: {}", clientIp);
            return new GeoDto.LanguageResponse(null, CountryLanguageMapper.DEFAULT_LANGUAGE);
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://ipapi.co/" + clientIp + "/json/"))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Geo lookup failed with status {}", response.statusCode());
                return new GeoDto.LanguageResponse(null, CountryLanguageMapper.DEFAULT_LANGUAGE);
            }

            JsonNode json = objectMapper.readTree(response.body());
            String countryCode = json.has("country_code")
                    ? json.get("country_code").asText(null)
                    : null;

            String language = countryLanguageMapper.resolve(countryCode);
            return new GeoDto.LanguageResponse(countryCode, language);

        } catch (Exception ex) {
            log.warn("Geo lookup error: {}", ex.getMessage());
            return new GeoDto.LanguageResponse(null, CountryLanguageMapper.DEFAULT_LANGUAGE);
        }
    }

    private boolean isPrivateOrLocalIp(String ip) {
        return ip.equals("127.0.0.1")
                || ip.equals("0:0:0:0:0:0:0:1")
                || ip.equals("::1")
                || ip.startsWith("10.")
                || ip.startsWith("192.168.")
                || ip.matches("^172\\.(1[6-9]|2[0-9]|3[0-1])\\..*");
    }
}