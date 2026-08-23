package com.trampopoints.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_requests")
public class TripRequest {

    @Id
    @Column(name = "request_id", nullable = false)
    private String requestId;

    // Origen embebido como columnas planas
    @Column(name = "origin_address")
    private String originAddress;
    @Column(name = "origin_latitude")
    private Double originLatitude;
    @Column(name = "origin_longitude")
    private Double originLongitude;

    // Destino embebido como columnas planas
    @Column(name = "destination_address")
    private String destinationAddress;
    @Column(name = "destination_latitude")
    private Double destinationLatitude;
    @Column(name = "destination_longitude")
    private Double destinationLongitude;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "departure_time")
    private String departureTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status")
    private String status; // SEARCHING, MATCHED, CANCELLED

    public TripRequest() {}

    public TripRequest(String requestId, Location origin, Location destination, String departureTime) {
        this.requestId = requestId;
        this.originAddress = origin.getAddress();
        this.originLatitude = origin.getLatitude();
        this.originLongitude = origin.getLongitude();
        this.destinationAddress = destination.getAddress();
        this.destinationLatitude = destination.getLatitude();
        this.destinationLongitude = destination.getLongitude();
        this.departureTime = departureTime;
        this.createdAt = LocalDateTime.now();
        this.status = "SEARCHING";
    }

    // Helpers para obtener Location compuesto
    public Location getOrigin() {
        return new Location(originLatitude, originLongitude, originAddress);
    }

    public void setOrigin(Location origin) {
        this.originAddress = origin.getAddress();
        this.originLatitude = origin.getLatitude();
        this.originLongitude = origin.getLongitude();
    }

    public Location getDestination() {
        return new Location(destinationLatitude, destinationLongitude, destinationAddress);
    }

    public void setDestination(Location destination) {
        this.destinationAddress = destination.getAddress();
        this.destinationLatitude = destination.getLatitude();
        this.destinationLongitude = destination.getLongitude();
    }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
