package com.trampopoints.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "driver_ratings")
public class DriverRating {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "driver_id", nullable = false)
    private String driverId;

    @Column(name = "passenger_name")
    private String passengerName;

    @Column(name = "score")
    private Integer score; // 1 to 5

    @Column(name = "comment")
    private String comment;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "driver_rating_tags", joinColumns = @JoinColumn(name = "rating_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(name = "created_at")
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
