package com.trampopoints.model;

import java.util.ArrayList;
import java.util.List;

public class Trip {
    private String tripId;
    private String status; // "CONFIRMED", "SEARCHING", etc.
    private Integer passengerCount;
    private Integer capacity;
    private Integer estimatedPricePerPassenger;
    private Integer estimatedSavingsPercent;
    private String departureTime;
    private Location origin;
    private Location destination;
    private Integer distanceMeters;
    private Integer durationSeconds;
    private String polyline;
    private List<Stop> stops = new ArrayList<>();

    public Trip() {}

    public Trip(String tripId, String status, Integer passengerCount, Integer capacity,
                Integer estimatedPricePerPassenger, Integer estimatedSavingsPercent, String departureTime,
                Location origin, Location destination, Integer distanceMeters, Integer durationSeconds,
                String polyline, List<Stop> stops) {
        this.tripId = tripId;
        this.status = status;
        this.passengerCount = passengerCount;
        this.capacity = capacity;
        this.estimatedPricePerPassenger = estimatedPricePerPassenger;
        this.estimatedSavingsPercent = estimatedSavingsPercent;
        this.departureTime = departureTime;
        this.origin = origin;
        this.destination = destination;
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.polyline = polyline;
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

    public Location getOrigin() {
        return origin;
    }

    public void setOrigin(Location origin) {
        this.origin = origin;
    }

    public Location getDestination() {
        return destination;
    }

    public void setDestination(Location destination) {
        this.destination = destination;
    }

    public Integer getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(Integer distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getPolyline() {
        return polyline;
    }

    public void setPolyline(String polyline) {
        this.polyline = polyline;
    }

    public List<Stop> getStops() {
        return stops;
    }

    public void setStops(List<Stop> stops) {
        this.stops = stops;
    }
}
