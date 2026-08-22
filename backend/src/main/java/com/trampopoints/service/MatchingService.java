package com.trampopoints.service;

import com.trampopoints.model.Location;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class MatchingService {

    @Value("${matching.max-origin-distance-km:2.0}")
    private double maxOriginDistanceKm;

    @Value("${matching.max-destination-distance-km:3.0}")
    private double maxDestinationDistanceKm;

    @Value("${matching.max-departure-time-diff-minutes:30}")
    private long maxDepartureTimeDiffMinutes;

    @Value("${vehicle.capacity:30}")
    private int vehicleCapacity;

    public boolean isCompatible(Location reqOrigin, Location reqDestination, String reqTimeStr,
                                Location tripOrigin, Location tripDestination, String tripTimeStr,
                                int currentPassengers) {
        if (currentPassengers >= vehicleCapacity) {
            return false;
        }

        // 1. Distancia de Origen
        double originDistKm = OsrmRouteService.calculateHaversineMeters(
                reqOrigin.getLatitude(), reqOrigin.getLongitude(),
                tripOrigin.getLatitude(), tripOrigin.getLongitude()
        ) / 1000.0;

        if (originDistKm > maxOriginDistanceKm) {
            return false;
        }

        // 2. Distancia de Destino
        double destDistKm = OsrmRouteService.calculateHaversineMeters(
                reqDestination.getLatitude(), reqDestination.getLongitude(),
                tripDestination.getLatitude(), tripDestination.getLongitude()
        ) / 1000.0;

        if (destDistKm > maxDestinationDistanceKm) {
            return false;
        }

        // 3. Diferencia de horario de salida
        long timeDiffMinutes = calculateTimeDifferenceMinutes(reqTimeStr, tripTimeStr);
        return Math.abs(timeDiffMinutes) <= maxDepartureTimeDiffMinutes;
    }

    private long calculateTimeDifferenceMinutes(String timeStr1, String timeStr2) {
        try {
            LocalDateTime dt1 = parseDateTime(timeStr1);
            LocalDateTime dt2 = parseDateTime(timeStr2);
            return ChronoUnit.MINUTES.between(dt1, dt2);
        } catch (Exception e) {
            // Si el formato de fecha no es parseable directamente, retornar 0 (compatible en horario)
            return 0;
        }
    }

    private LocalDateTime parseDateTime(String text) {
        if (text == null) return LocalDateTime.now();
        if (text.contains("T")) {
            return LocalDateTime.parse(text, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        return LocalDateTime.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public double getMaxOriginDistanceKm() {
        return maxOriginDistanceKm;
    }

    public double getMaxDestinationDistanceKm() {
        return maxDestinationDistanceKm;
    }

    public long getMaxDepartureTimeDiffMinutes() {
        return maxDepartureTimeDiffMinutes;
    }

    public int getVehicleCapacity() {
        return vehicleCapacity;
    }
}
