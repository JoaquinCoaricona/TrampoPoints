package com.trampopoints.dto;

public class TripMatchDto {
    private String tripId;
    private Integer passengerCount;
    private Integer capacity;
    private Integer estimatedPrice;
    private Integer estimatedSavings;
    private String departureTime;

    public TripMatchDto() {}

    public TripMatchDto(String tripId, Integer passengerCount, Integer capacity, Integer estimatedPrice, Integer estimatedSavings, String departureTime) {
        this.tripId = tripId;
        this.passengerCount = passengerCount;
        this.capacity = capacity;
        this.estimatedPrice = estimatedPrice;
        this.estimatedSavings = estimatedSavings;
        this.departureTime = departureTime;
    }

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(Integer estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public Integer getEstimatedSavings() {
        return estimatedSavings;
    }

    public void setEstimatedSavings(Integer estimatedSavings) {
        this.estimatedSavings = estimatedSavings;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }
}
