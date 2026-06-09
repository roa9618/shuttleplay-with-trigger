package com.shuttleplay.server.domain.auth.dto.response;

import com.shuttleplay.server.domain.user.entity.User;
import com.shuttleplay.server.domain.user.enums.AuthProvider;
import com.shuttleplay.server.domain.user.enums.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginUserResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final UserRole role;
    private final AuthProvider provider;
    private final boolean profileCompleted;

    @Builder
    private LoginUserResponse(
            Long id,
            String name,
            String email,
            UserRole role,
            AuthProvider provider,
            boolean profileCompleted
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.profileCompleted = profileCompleted;
    }

    public static LoginUserResponse from(User user) {
        return LoginUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .profileCompleted(user.isProfileCompleted())
                .build();
    }
}