package com.medsphere.core.exception;

import com.medsphere.core.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── App-level known errors ────────────────────────────────

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        log.warn("AppException [{}]: {}", ex.getErrorCode(), ex.getMessage());
        return ResponseEntity
                .status(ex.getErrorCode().getHttpStatus())
                .body(ApiResponse.fail(
                        ex.getErrorCode().name(),
                        ex.getErrorCode().getMessageKey()
                ));
    }

    // ── Bean validation errors (@Valid) ───────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        log.debug("Validation failed: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail(ErrorCode.VALIDATION_FAILED.name(), message));
    }

    // ── Spring Security errors ────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.fail(ErrorCode.ACCESS_DENIED.name(),
                        ErrorCode.ACCESS_DENIED.getMessageKey()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.fail(ErrorCode.INVALID_CREDENTIALS.name(),
                        ErrorCode.INVALID_CREDENTIALS.getMessageKey()));
    }

    // ── Catch-all ─────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.name(),
                        ErrorCode.INTERNAL_ERROR.getMessageKey()));
    }
}