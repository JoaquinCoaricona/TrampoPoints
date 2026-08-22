package com.trampopoints.dto;

public class UpdateVehicleStatusRequestDto {
    private String status; // AVAILABLE, UNAVAILABLE, OUT_OF_SERVICE

    public UpdateVehicleStatusRequestDto() {}

    public UpdateVehicleStatusRequestDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
