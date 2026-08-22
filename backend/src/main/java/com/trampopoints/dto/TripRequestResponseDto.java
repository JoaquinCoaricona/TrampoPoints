package com.trampopoints.dto;

public class TripRequestResponseDto {
    private String requestId;
    private String status;
    private String message;

    public TripRequestResponseDto() {}

    public TripRequestResponseDto(String requestId, String status, String message) {
        this.requestId = requestId;
        this.status = status;
        this.message = message;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
