package com.trampopoints.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trampopoints.dto.OptimizeStopRequestDto;
import com.trampopoints.dto.OrderedStopDto;
import com.trampopoints.dto.RouteOptimizationResponseDto;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Primary
@Service("osrmRouteService")
public class OsrmRouteService implements RouteService {

    private static final double EARTH_RADIUS_METERS = 6371000.0;
    private static final String OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/driving/";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OsrmRouteService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(4))
                .build();
        this.objectMapper = new ObjectMapper();
    }

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

        List<double[]> allCoords = new ArrayList<>();
        allCoords.add(new double[]{origin.getLatitude(), origin.getLongitude()});
        for (OrderedStopDto stop : orderedStops) {
            allCoords.add(new double[]{stop.getLatitude(), stop.getLongitude()});
        }
        allCoords.add(new double[]{destination.getLatitude(), destination.getLongitude()});

        // Consultar el motor OSRM para obtener la distancia real por calles, duración y polyline
        OsrmResult osrmResult = fetchRealOsrmRoute(allCoords);

        return new RouteOptimizationResponseDto(
                osrmResult.distanceMeters,
                osrmResult.durationSeconds,
                orderedStops,
                osrmResult.polyline
        );
    }

    @Override
    public String generatePolyline(Location origin, List<Stop> stops, Location destination) {
        List<double[]> coords = extractCoords(origin, stops, destination);
        OsrmResult result = fetchRealOsrmRoute(coords);
        return result.polyline;
    }

    @Override
    public int calculateDistanceMeters(Location origin, Location destination) {
        if (origin == null || destination == null) return 0;
        List<double[]> coords = new ArrayList<>();
        coords.add(new double[]{origin.getLatitude(), origin.getLongitude()});
        coords.add(new double[]{destination.getLatitude(), destination.getLongitude()});

        OsrmResult result = fetchRealOsrmRoute(coords);
        return result.distanceMeters;
    }

    @Override
    public int calculateDurationSeconds(int distanceMeters) {
        // Velocidad promedio urbana/suburbana en combi (~30 km/h = 8.33 m/s)
        return (int) Math.max(300, Math.round(distanceMeters / 8.33));
    }

    private List<double[]> extractCoords(Location origin, List<Stop> stops, Location destination) {
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
        return coords;
    }

    /**
     * Consulta al API real de OSRM pasando la secuencia de coordenadas en formato lng,lat
     */
    private OsrmResult fetchRealOsrmRoute(List<double[]> coords) {
        if (coords == null || coords.size() < 2) {
            return new OsrmResult(0, 0, "");
        }

        try {
            StringBuilder coordString = new StringBuilder();
            for (int i = 0; i < coords.size(); i++) {
                if (i > 0) coordString.append(";");
                // OSRM requiere formato: longitude,latitude
                coordString.append(String.format(Locale.US, "%.6f,%.6f", coords.get(i)[1], coords.get(i)[0]));
            }

            String url = OSRM_BASE_URL + coordString.toString() + "?overview=full&geometries=polyline&steps=false";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(4))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                JsonNode routesNode = rootNode.path("routes");
                if (routesNode.isArray() && routesNode.size() > 0) {
                    JsonNode route = routesNode.get(0);
                    int distanceMeters = (int) Math.round(route.path("distance").asDouble(0.0));
                    int durationSeconds = (int) Math.round(route.path("duration").asDouble(0.0));
                    String geometryPolyline = route.path("geometry").asText("");

                    if (distanceMeters > 0 && !geometryPolyline.isEmpty()) {
                        return new OsrmResult(distanceMeters, durationSeconds, geometryPolyline);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Advertencia: Falló la consulta OSRM en tiempo real (" + e.getMessage() + "). Usando fallback Haversine.");
        }

        // Fallback de resiliencia si OSRM no responde
        return calculateHaversineFallback(coords);
    }

    private OsrmResult calculateHaversineFallback(List<double[]> coords) {
        double totalDistance = 0.0;
        for (int i = 1; i < coords.size(); i++) {
            totalDistance += calculateHaversineMeters(
                    coords.get(i - 1)[0], coords.get(i - 1)[1],
                    coords.get(i)[0], coords.get(i)[1]
            );
        }
        int dist = (int) Math.round(totalDistance);
        int dur = calculateDurationSeconds(dist);
        String polyline = encodePolyline(coords);

        return new OsrmResult(dist, dur, polyline);
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

    private static class OsrmResult {
        final int distanceMeters;
        final int durationSeconds;
        final String polyline;

        OsrmResult(int distanceMeters, int durationSeconds, String polyline) {
            this.distanceMeters = distanceMeters;
            this.durationSeconds = durationSeconds;
            this.polyline = polyline;
        }
    }
}
