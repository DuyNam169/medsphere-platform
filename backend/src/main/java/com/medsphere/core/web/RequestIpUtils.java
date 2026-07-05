package com.medsphere.core.web;

import jakarta.servlet.http.HttpServletRequest;

public final class RequestIpUtils {

    private RequestIpUtils() {}

    public static String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}