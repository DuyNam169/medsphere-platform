package com.medsphere.core.constants;

public final class AppConstants {

    private AppConstants() {}

    public static final String API_VERSION   = "/v1";
    public static final String AUTH_BASE     = API_VERSION + "/auth";
    public static final String USER_BASE     = API_VERSION + "/users";
    public static final String FEED_BASE     = API_VERSION + "/feed";
    public static final String AI_BASE       = API_VERSION + "/ai";
    public static final String GEO_BASE      = API_VERSION + "/geo";

    public static final int    DEFAULT_PAGE_SIZE = 20;
    public static final int    MAX_PAGE_SIZE     = 100;

    public static final String BEARER_PREFIX  = "Bearer ";
    public static final String AUTH_HEADER    = "Authorization";
}