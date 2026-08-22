package com.trampopoints.model;

import java.time.LocalDateTime;

public class TripRequest {
    private String requestId;
    private Location origin;
    private Location destination;
    private String departureTime;
    private LocalDateTime createdAt;
    private String status; // "SEARCHING", "MATCHED", "CANCELLED"

    public TripRequest() {}

    public TripRequest(String requestId, Location origin, Location destination, String departureTime) {
        this.requestId = requestId;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.createdAt = LocalDateTime.now();
        this.status = "SEARCHING";
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
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

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
