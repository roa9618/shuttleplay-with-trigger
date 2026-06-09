package com.shuttleplay.server.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shuttleplay.server.global.error.ErrorCode;
import com.shuttleplay.server.global.error.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
        ErrorCode errorCode = getErrorCode(request);

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(ErrorResponse.of(errorCode)));
    }

    private ErrorCode getErrorCode(HttpServletRequest request) {
        Object exception = request.getAttribute("exception");

        if (exception instanceof ErrorCode errorCode) {
            return errorCode;
        }

        return ErrorCode.UNAUTHORIZED;
    }
}