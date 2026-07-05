package com.medsphere.core.config;

import com.medsphere.core.constants.AppConstants;
import com.medsphere.core.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    // ── Public endpoints (no token required) ─────────────────

    private static final String[] PUBLIC_POST = {
            AppConstants.AUTH_BASE + "/login",
            AppConstants.AUTH_BASE + "/register",
            AppConstants.AUTH_BASE + "/register/doctor",
            AppConstants.AUTH_BASE + "/register/business",
            AppConstants.AUTH_BASE + "/google-login",
            AppConstants.AUTH_BASE + "/refresh",
            AppConstants.AUTH_BASE + "/forgot-password/request-otp",
            AppConstants.AUTH_BASE + "/forgot-password/verify-otp",
            AppConstants.AUTH_BASE + "/forgot-password/reset",
            AppConstants.AUTH_BASE + "/forgot-password/**",
            AppConstants.AUTH_BASE + "/security/logout-all-devices",
    };

        private static final String[] PUBLIC_GET = {
                "/v1/health",
                "/actuator/health",
                AppConstants.GEO_BASE + "/language",
        };

    // ── Filter chain ─────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, PUBLIC_POST).permitAll()
                        .requestMatchers(HttpMethod.GET,  PUBLIC_GET).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                // Return 401 as JSON instead of redirect to login page
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json");
                            res.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"TOKEN_MISSING","message":"auth.token_missing"}}
                                    """
                            );
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType("application/json");
                            res.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"ACCESS_DENIED","message":"auth.access_denied"}}
                                    """
                            );
                        })
                );

        return http.build();
    }

    // ── Beans ─────────────────────────────────────────────────

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt strength 12 — good balance of security vs speed
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}