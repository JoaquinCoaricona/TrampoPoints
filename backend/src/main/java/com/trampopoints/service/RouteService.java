package com.trampopoints.service;

import com.trampopoints.dto.OptimizeStopRequestDto;
import com.trampopoints.dto.RouteOptimizationResponseDto;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;

import java.util.List;

public interface RouteService {
    RouteOptimizationResponseDto optimizeRoute(OptimizeStopRequestDto origin, List<OptimizeStopRequestDto> stops, OptimizeStopRequestDto destination);
    String generatePolyline(Location origin, List<Stop> stops, Location destination);
    int calculateDistanceMeters(Location origin, Location destination);
    int calculateDurationSeconds(int distanceMeters);
}
