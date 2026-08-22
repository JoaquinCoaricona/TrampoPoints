package com.trampopoints.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DriverRatingDto {
    private String id;
    private String passengerName;
    private Integer score;
    private String comment;
    private List<String> tags = new ArrayList<>();
    private LocalDateTime createdAt;

    public DriverRatingDto() {}

    public DriverRatingDto(String id, String passengerName, Integer score, String comment, List<String> tags, LocalDateTime createdAt) {
        this.id = id;
        this.passengerName = passengerName;
        this.score = score;
        this.comment = comment;
        this.tags = tags != null ? tags : new ArrayList<>();
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
