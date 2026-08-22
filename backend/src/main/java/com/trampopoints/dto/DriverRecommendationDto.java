package com.trampopoints.dto;

import java.time.LocalDateTime;

public class DriverRecommendationDto {
    private String id;
    private String passengerName;
    private Integer score;
    private String quote;
    private String tripRoute;
    private LocalDateTime createdAt;

    public DriverRecommendationDto() {}

    public DriverRecommendationDto(String id, String passengerName, Integer score, String quote, String tripRoute, LocalDateTime createdAt) {
        this.id = id;
        this.passengerName = passengerName;
        this.score = score;
        this.quote = quote;
        this.tripRoute = tripRoute;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getQuote() {
        return quote;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

    public String getTripRoute() {
        return tripRoute;
    }

    public void setTripRoute(String tripRoute) {
        this.tripRoute = tripRoute;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
