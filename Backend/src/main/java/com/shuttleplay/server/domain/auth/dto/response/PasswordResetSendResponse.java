package com.shuttleplay.server.domain.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PasswordResetSendResponse {
    private final String email;
    private final int expiresInMinutes;

    @Builder
    private PasswordResetSendResponse(String email, int expiresInMinutes) {
        this.email = email;
        this.expiresInMinutes = expiresInMinutes;
    }

    public static PasswordResetSendResponse of(String email, int expiresInMinutes) {
        return PasswordResetSendResponse.builder()
                .email(email)
                .expiresInMinutes(expiresInMinutes)
                .build();
    }
}