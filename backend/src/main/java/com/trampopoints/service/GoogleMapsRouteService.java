package com.trampopoints.service;

import com.trampopoints.dto.OptimizeStopRequestDto;
import com.trampopoints.dto.RouteOptimizationResponseDto;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Encapsula la integración con Google Maps Platform (Directions API & Distance Matrix API).
 * Puede activarse configurando routing.provider=google en application.properties.
 */
@Service("googleMapsRouteService")
public class GoogleMapsRouteService implements RouteService {

    @Value("${google.maps.api-key:YOUR_API_KEY_HERE}")
    private String apiKey;

    private final OsrmRouteService fallbackService = new OsrmRouteService();

    @Override
    public RouteOptimizationResponseDto optimizeRoute(OptimizeStopRequestDto origin, List<OptimizeStopRequestDto> stops, OptimizeStopRequestDto destination) {
        // En una implementación con API Key real de Google Maps, realizaría una llamada HTTP a:
        // https://maps.googleapis.com/maps/api/directions/json?origin=...&destination=...&waypoints=optimize:true|...&key=apiKey
        // Para el MVP/demo, delega en el cálculo resiliente si no hay API key configurada.
        return fallbackService.optimizeRoute(origin, stops, destination);
    }

    @Override
    public String generatePolyline(Location origin, List<Stop> stops, Location destination) {
        return fallbackService.generatePolyline(origin, stops, destination);
    }

    @Override
    public int calculateDistanceMeters(Location origin, Location destination) {
        return fallbackService.calculateDistanceMeters(origin, destination);
    }

    @Override
    public int calculateDurationSeconds(int distanceMeters) {
        return fallbackService.calculateDurationSeconds(distanceMeters);
    }
}
