package com.trampopoints.dto;

public class TripRequestDto {
    private LocationDto origin;
    private LocationDto destination;
    private String departureTime;

    public TripRequestDto() {}

    public TripRequestDto(LocationDto origin, LocationDto destination, String departureTime) {
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
    }

    public LocationDto getOrigin() {
        return origin;
    }

    public void setOrigin(LocationDto origin) {
        this.origin = origin;
    }

    public LocationDto getDestination() {
        return destination;
    }

    public void setDestination(LocationDto destination) {
        this.destination = destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }
}
