package com.trampopoints.dto;

import java.util.List;

public class RouteOptimizationResponseDto {
    private Integer distanceMeters;
    private Integer durationSeconds;
    private List<OrderedStopDto> orderedStops;
    private String polyline;

    public RouteOptimizationResponseDto() {}

    public RouteOptimizationResponseDto(Integer distanceMeters, Integer durationSeconds, List<OrderedStopDto> orderedStops, String polyline) {
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.orderedStops = orderedStops;
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

    public List<OrderedStopDto> getOrderedStops() {
        return orderedStops;
    }

    public void setOrderedStops(List<OrderedStopDto> orderedStops) {
        this.orderedStops = orderedStops;
    }

    public String getPolyline() {
        return polyline;
    }

    public void setPolyline(String polyline) {
        this.polyline = polyline;
    }
}
