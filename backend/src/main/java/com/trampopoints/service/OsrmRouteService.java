package com.trampopoints.service;

import com.trampopoints.dto.OptimizeStopRequestDto;
import com.trampopoints.dto.OrderedStopDto;
import com.trampopoints.dto.RouteOptimizationResponseDto;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Primary
@Service("osrmRouteService")
public class OsrmRouteService implements RouteService {

    private static final double EARTH_RADIUS_METERS = 6371000.0;

    @Override
    public RouteOptimizationResponseDto optimizeRoute(OptimizeStopRequestDto origin, List<OptimizeStopRequestDto> stops, OptimizeStopRequestDto destination) {
        List<OrderedStopDto> orderedStops = new ArrayList<>();
        
        if (stops != null && !stops.isEmpty()) {
            List<OptimizeStopRequestDto> remaining = new ArrayList<>(stops);
            OptimizeStopRequestDto current = origin;
            int orderCounter = 1;

            while (!remaining.isEmpty()) {
                final OptimizeStopRequestDto currLoc = current;
                remaining.sort(Comparator.comparingDouble(s -> calculateHaversineMeters(currLoc.getLatitude(), currLoc.getLongitude(), s.getLatitude(), s.getLongitude())));
                OptimizeStopRequestDto nearest = remaining.remove(0);
                orderedStops.add(new OrderedStopDto(orderCounter++, nearest.getLatitude(), nearest.getLongitude()));
                current = nearest;
            }
        }

        // Calculate total distance through ordered path
        double totalDistance = 0.0;
        double currLat = origin.getLatitude();
        double currLng = origin.getLongitude();

        List<double[]> allCoords = new ArrayList<>();
        allCoords.add(new double[]{currLat, currLng});

        for (OrderedStopDto stop : orderedStops) {
            totalDistance += calculateHaversineMeters(currLat, currLng, stop.getLatitude(), stop.getLongitude());
            currLat = stop.getLatitude();
            currLng = stop.getLongitude();
            allCoords.add(new double[]{currLat, currLng});
        }

        totalDistance += calculateHaversineMeters(currLat, currLng, destination.getLatitude(), destination.getLongitude());
        allCoords.add(new double[]{destination.getLatitude(), destination.getLongitude()});

        int distanceMeters = (int) Math.round(totalDistance);
        int durationSeconds = calculateDurationSeconds(distanceMeters);
        String polyline = encodePolyline(allCoords);

        return new RouteOptimizationResponseDto(distanceMeters, durationSeconds, orderedStops, polyline);
    }

    @Override
    public String generatePolyline(Location origin, List<Stop> stops, Location destination) {
        List<double[]> coords = new ArrayList<>();
        if (origin != null) {
            coords.add(new double[]{origin.getLatitude(), origin.getLongitude()});
        }
        if (stops != null) {
            for (Stop s : stops) {
                coords.add(new double[]{s.getLatitude(), s.getLongitude()});
            }
        }
        if (destination != null) {
            coords.add(new double[]{destination.getLatitude(), destination.getLongitude()});
        }
        return encodePolyline(coords);
    }

    @Override
    public int calculateDistanceMeters(Location origin, Location destination) {
        if (origin == null || destination == null) return 0;
        return (int) Math.round(calculateHaversineMeters(
                origin.getLatitude(), origin.getLongitude(),
                destination.getLatitude(), destination.getLongitude()
        ));
    }

    @Override
    public int calculateDurationSeconds(int distanceMeters) {
        // Average speed: ~25-30 km/h (8.33 m/s) in urban/suburban minibus route
        return (int) Math.max(300, Math.round(distanceMeters / 8.33));
    }

    public static double calculateHaversineMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private String encodePolyline(List<double[]> points) {
        StringBuilder result = new StringBuilder();
        int lastLat = 0;
        int lastLng = 0;

        for (double[] point : points) {
            int lat = (int) Math.round(point[0] * 1e5);
            int lng = (int) Math.round(point[1] * 1e5);

            int dLat = lat - lastLat;
            int dLng = lng - lastLng;

            encodeValue(dLat, result);
            encodeValue(dLng, result);

            lastLat = lat;
            lastLng = lng;
        }

        return result.toString();
    }

    private void encodeValue(int value, StringBuilder result) {
        int v = value < 0 ? ~(value << 1) : (value << 1);
        while (v >= 0x20) {
            result.append((char) ((0x20 | (v & 0x1f)) + 63));
            v >>= 5;
        }
        result.append((char) (v + 63));
    }
}
