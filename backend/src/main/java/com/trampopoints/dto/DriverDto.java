package com.trampopoints.dto;

public class DriverDto {
    private String id;
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String status;
    private Double ratingAverage;
    private Integer totalRatings;
    private Integer tripsCompleted;

    public DriverDto() {}

    public DriverDto(String id, String name, String lastName, String email, String phone, String avatarUrl, String status, Double ratingAverage, Integer totalRatings, Integer tripsCompleted) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.ratingAverage = ratingAverage;
        this.totalRatings = totalRatings;
        this.tripsCompleted = tripsCompleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getRatingAverage() {
        return ratingAverage;
    }

    public void setRatingAverage(Double ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }

    public Integer getTripsCompleted() {
        return tripsCompleted;
    }

    public void setTripsCompleted(Integer tripsCompleted) {
        this.tripsCompleted = tripsCompleted;
    }
}
