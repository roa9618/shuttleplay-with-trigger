package com.shuttleplay.server.domain.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginResponse {
    private final String accessToken;
    private final String refreshToken;
    private final String tokenType;
    private final long expiresIn;
    private final Long refreshTokenExpiresIn;
    private final LoginUserResponse user;

    @Builder
    private LoginResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresIn,
            Long refreshTokenExpiresIn,
            LoginUserResponse user
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.refreshTokenExpiresIn = refreshTokenExpiresIn;
        this.user = user;
    }

    public static LoginResponse of(
            String accessToken,
            String refreshToken,
            long expiresIn,
            Long refreshTokenExpiresIn,
            LoginUserResponse user
    ) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .refreshTokenExpiresIn(refreshTokenExpiresIn)
                .user(user)
                .build();
    }
}