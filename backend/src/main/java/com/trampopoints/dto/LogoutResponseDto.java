package com.trampopoints.dto;

public class LogoutResponseDto {
    private boolean success;
    private String message;

    public LogoutResponseDto() {}

    public LogoutResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
