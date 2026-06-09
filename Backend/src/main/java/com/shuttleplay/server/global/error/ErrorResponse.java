package com.shuttleplay.server.global.error;

import lombok.Getter;

@Getter
public class ErrorResponse {
    private final boolean success;
    private final String message;
    private final ErrorDetail error;

    private ErrorResponse(boolean success, String message, ErrorDetail error) {
        this.success = success;
        this.message = message;
        this.error = error;
    }

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(
                false,
                errorCode.getMessage(),
                new ErrorDetail(errorCode.getCode(), errorCode.getMessage())
        );
    }

    public static ErrorResponse of(ErrorCode errorCode, String detail) {
        return new ErrorResponse(
                false,
                errorCode.getMessage(),
                new ErrorDetail(errorCode.getCode(), detail)
        );
    }

    @Getter
    public static class ErrorDetail {

        private final String code;
        private final String detail;

        private ErrorDetail(String code, String detail) {
            this.code = code;
            this.detail = detail;
        }
    }
}