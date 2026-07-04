package com.medsphere.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;

/**
 * Unified API response envelope.
 *
 * Success:  { success: true,  data: T,    error: null }
 * Failure:  { success: false, data: null, error: ErrorDetail }
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean   success;
    private final T         data;
    private final ErrorDetail error;
    private final Instant   timestamp = Instant.now();

    private ApiResponse(boolean success, T data, ErrorDetail error) {
        this.success = success;
        this.data    = data;
        this.error   = error;
    }

    // ── Factory methods ──────────────────────────────────────

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, null, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorDetail(code, message));
    }

    // ── Nested error detail ──────────────────────────────────

    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorDetail {
        private final String code;
        private final String message;

        public ErrorDetail(String code, String message) {
            this.code    = code;
            this.message = message;
        }
    }
}