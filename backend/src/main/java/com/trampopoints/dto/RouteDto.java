package com.trampopoints.dto;

public class RouteDto {
    private Integer distanceMeters;
    private Integer durationSeconds;
    private String polyline;

    public RouteDto() {}

    public RouteDto(Integer distanceMeters, Integer durationSeconds, String polyline) {
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.polyline = polyline;
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
}
