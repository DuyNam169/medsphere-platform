package com.medsphere.modules.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.medsphere.core.exception.AppException;
import com.medsphere.core.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

/**
 * Verifies a Google id_token issued by the frontend (Google Sign-In).
 * Returns a GoogleUserInfo record with verified fields.
 */
@Slf4j
@Component
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(
            @Value("${app.google.client-id}") String clientId) {

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleUserInfo verify(String idToken) {
        try {
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                throw new AppException(ErrorCode.TOKEN_INVALID, "Google id_token is invalid");
            }
            GoogleIdToken.Payload payload = token.getPayload();
            return new GoogleUserInfo(
                    payload.getSubject(),
                    payload.getEmail(),
                    (String) payload.get("name"),
                    (String) payload.get("picture")
            );
        } catch (AppException ex) {
            throw ex;
        } catch (Exception ex) {
            log.warn("Google token verification failed: {}", ex.getMessage());
            throw new AppException(ErrorCode.TOKEN_INVALID, ex);
        }
    }

    public record GoogleUserInfo(
            String googleId,
            String email,
            String fullName,
            String avatarUrl
    ) {}
}