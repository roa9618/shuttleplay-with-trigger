package com.shuttleplay.server.domain.auth.service;

import com.shuttleplay.server.domain.auth.dto.request.RegisterRequest;
import com.shuttleplay.server.domain.auth.dto.response.RegisterResponse;
import com.shuttleplay.server.domain.user.entity.User;
import com.shuttleplay.server.domain.user.enums.AuthProvider;
import com.shuttleplay.server.domain.user.repository.UserRepository;
import com.shuttleplay.server.domain.user.util.InitialMmrCalculator;
import com.shuttleplay.server.global.error.BusinessException;
import com.shuttleplay.server.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        validateDuplicateEmail(request.getEmail());

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        int initialMmr = InitialMmrCalculator.calculate(request.getGrade());

        User user = User.createLocalUser(
                request.getEmail(),
                encodedPassword,
                request.getName(),
                request.getGender(),
                request.getAgeGroup(),
                request.getGrade(),
                initialMmr
        );

        User savedUser = userRepository.save(user);

        return RegisterResponse.from(savedUser);
    }

    private void validateDuplicateEmail(String email) {
        boolean exists = userRepository.existsByEmailAndProvider(email, AuthProvider.LOCAL);

        if (exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
    }
}