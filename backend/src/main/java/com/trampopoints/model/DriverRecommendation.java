package com.trampopoints.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_recommendations")
public class DriverRecommendation {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "driver_id", nullable = false)
    private String driverId;

    @Column(name = "passenger_name")
    private String passengerName;

    @Column(name = "score")
    private Integer score;

    @Column(name = "quote")
    private String quote;

    @Column(name = "trip_route")
    private String tripRoute;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public DriverRecommendation() {
        this.createdAt = LocalDateTime.now();
    }

    public DriverRecommendation(String id, String driverId, String passengerName, Integer score, String quote, String tripRoute) {
        this.id = id;
        this.driverId = driverId;
        this.passengerName = passengerName;
        this.score = score;
        this.quote = quote;
        this.tripRoute = tripRoute;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public String getTripRoute() { return tripRoute; }
    public void setTripRoute(String tripRoute) { this.tripRoute = tripRoute; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
