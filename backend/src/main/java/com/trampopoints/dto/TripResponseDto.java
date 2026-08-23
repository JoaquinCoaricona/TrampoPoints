package com.trampopoints.dto;

import java.util.List;

public class TripResponseDto {
    private String tripId;
    private String status;
    private Integer passengerCount;
    private Integer capacity;
    private Integer estimatedPricePerPassenger;
    private Integer estimatedSavingsPercent;
    private String departureTime;
    private RouteDto route;
    private List<StopDto> stops;
    private DriverDto driver;
    private VehicleDto vehicle;

    public TripResponseDto() {}

    public TripResponseDto(String tripId, String status, Integer passengerCount, Integer capacity,
                           Integer estimatedPricePerPassenger, Integer estimatedSavingsPercent,
                           String departureTime, RouteDto route, List<StopDto> stops) {
        this.tripId = tripId;
        this.status = status;
        this.passengerCount = passengerCount;
        this.capacity = capacity;
        this.estimatedPricePerPassenger = estimatedPricePerPassenger;
        this.estimatedSavingsPercent = estimatedSavingsPercent;
        this.departureTime = departureTime;
        this.route = route;
        this.stops = stops;
    }

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Integer getEstimatedPricePerPassenger() {
        return estimatedPricePerPassenger;
    }

    public void setEstimatedPricePerPassenger(Integer estimatedPricePerPassenger) {
        this.estimatedPricePerPassenger = estimatedPricePerPassenger;
    }

    public Integer getEstimatedSavingsPercent() {
        return estimatedSavingsPercent;
    }

    public void setEstimatedSavingsPercent(Integer estimatedSavingsPercent) {
        this.estimatedSavingsPercent = estimatedSavingsPercent;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public RouteDto getRoute() {
        return route;
    }

    public void setRoute(RouteDto route) {
        this.route = route;
    }

    public List<StopDto> getStops() {
        return stops;
    }

    public void setStops(List<StopDto> stops) {
        this.stops = stops;
    }

    public DriverDto getDriver() {
        return driver;
    }

    public void setDriver(DriverDto driver) {
        this.driver = driver;
    }

    public VehicleDto getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleDto vehicle) {
        this.vehicle = vehicle;
    }
}
