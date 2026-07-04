package com.medsphere.core.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // ── Auth ──────────────────────────────────────────────────
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED,        "auth.invalid_credentials"),
    ACCOUNT_LOCKED(HttpStatus.FORBIDDEN,                "auth.account_locked"),
    ACCOUNT_DISABLED(HttpStatus.FORBIDDEN,              "auth.account_disabled"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED,              "auth.token_expired"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED,              "auth.token_invalid"),
    TOKEN_MISSING(HttpStatus.UNAUTHORIZED,              "auth.token_missing"),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED,      "auth.refresh_token_invalid"),

    // ── User ─────────────────────────────────────────────────
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,                "user.not_found"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT,           "user.email_exists"),
    PHONE_ALREADY_EXISTS(HttpStatus.CONFLICT,           "user.phone_exists"),

    // ── Validation ────────────────────────────────────────────
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST,           "validation.failed"),
    MISSING_REQUIRED_FIELD(HttpStatus.BAD_REQUEST,      "validation.missing_field"),

    // ── Authorization ─────────────────────────────────────────
    ACCESS_DENIED(HttpStatus.FORBIDDEN,                 "auth.access_denied"),

    // ── Generic ───────────────────────────────────────────────
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,    "error.internal"),
    NOT_FOUND(HttpStatus.NOT_FOUND,                     "error.not_found"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST,                 "error.bad_request");

    private final HttpStatus httpStatus;
    private final String     messageKey;

    ErrorCode(HttpStatus httpStatus, String messageKey) {
        this.httpStatus = httpStatus;
        this.messageKey = messageKey;
    }

    public HttpStatus getHttpStatus() { return httpStatus; }
    public String     getMessageKey() { return messageKey; }
}