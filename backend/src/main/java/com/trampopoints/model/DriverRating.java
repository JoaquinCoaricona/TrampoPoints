package com.trampopoints.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DriverRating {
    private String id;
    private String driverId;
    private String passengerName;
    private Integer score; // 1 to 5
    private String comment;
    private List<String> tags = new ArrayList<>();
    private LocalDateTime createdAt;

    public DriverRating() {
        this.createdAt = LocalDateTime.now();
    }

    public DriverRating(String id, String driverId, String passengerName, Integer score, String comment, List<String> tags) {
        this.id = id;
        this.driverId = driverId;
        this.passengerName = passengerName;
        this.score = score;
        this.comment = comment;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
