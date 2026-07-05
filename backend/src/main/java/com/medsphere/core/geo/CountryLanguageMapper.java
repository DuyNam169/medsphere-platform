package com.medsphere.core.geo;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * Ánh xạ mã quốc gia (ISO 3166-1 alpha-2) sang mã ngôn ngữ hệ thống hỗ trợ.
 * Dùng chung cho: detect ngôn ngữ website (GeoService) và ngôn ngữ email (mail module).
 * Mở rộng sau này: chỉ cần thêm dòng vào COUNTRY_TO_LANGUAGE, không cần sửa logic gọi nó.
 */
@Component
public class CountryLanguageMapper {

    public static final String DEFAULT_LANGUAGE = "en";

    // Ngôn ngữ nào chưa có file resource tương ứng thì đừng thêm vào đây —
    // trước tiên phải tạo bundle (ví dụ messages_fr.properties) rồi mới map quốc gia sang nó.
    private static final Set<String> SUPPORTED_LANGUAGES = Set.of("en", "vi");

    private static final Map<String, String> COUNTRY_TO_LANGUAGE = Map.ofEntries(
            Map.entry("VN", "vi")
            // Thêm quốc gia mới tại đây khi có thêm ngôn ngữ hỗ trợ, ví dụ:
            // Map.entry("FR", "fr"),
            // Map.entry("US", "en"),
    );

    public String resolve(String countryCode) {
        if (countryCode == null) return DEFAULT_LANGUAGE;
        String lang = COUNTRY_TO_LANGUAGE.get(countryCode.toUpperCase());
        return (lang != null && SUPPORTED_LANGUAGES.contains(lang)) ? lang : DEFAULT_LANGUAGE;
    }

    public boolean isSupported(String language) {
        return SUPPORTED_LANGUAGES.contains(language);
    }
}