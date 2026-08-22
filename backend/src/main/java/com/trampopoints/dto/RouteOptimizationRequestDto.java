package com.trampopoints.dto;

import java.util.List;

public class RouteOptimizationRequestDto {
    private OptimizeStopRequestDto origin;
    private List<OptimizeStopRequestDto> stops;
    private OptimizeStopRequestDto destination;

    public RouteOptimizationRequestDto() {}

    public RouteOptimizationRequestDto(OptimizeStopRequestDto origin, List<OptimizeStopRequestDto> stops, OptimizeStopRequestDto destination) {
        this.origin = origin;
        this.stops = stops;
        this.destination = destination;
    }

    public OptimizeStopRequestDto getOrigin() {
        return origin;
    }

    public void setOrigin(OptimizeStopRequestDto origin) {
        this.origin = origin;
    }

    public List<OptimizeStopRequestDto> getStops() {
        return stops;
    }

    public void setStops(List<OptimizeStopRequestDto> stops) {
        this.stops = stops;
    }

    public OptimizeStopRequestDto getDestination() {
        return destination;
    }

    public void setDestination(OptimizeStopRequestDto destination) {
        this.destination = destination;
    }
}
