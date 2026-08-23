package com.trampopoints.service;

import com.trampopoints.model.Location;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class MatchingService {

    @Value("${matching.max-origin-distance-km:3.0}")
    private double maxOriginDistanceKm;

    @Value("${matching.max-destination-distance-km:4.0}")
    private double maxDestinationDistanceKm;

    @Value("${matching.max-corridor-deviation-km:3.5}")
    private double maxCorridorDeviationKm;

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

        // 1. Diferencia de horario de salida
        long timeDiffMinutes = calculateTimeDifferenceMinutes(reqTimeStr, tripTimeStr);
        if (Math.abs(timeDiffMinutes) > maxDepartureTimeDiffMinutes) {
            return false;
        }

        // 2. Coincidencia clásica (origen cerca de origen y destino cerca de destino)
        double originDistKm = OsrmRouteService.calculateHaversineMeters(
                reqOrigin.getLatitude(), reqOrigin.getLongitude(),
                tripOrigin.getLatitude(), tripOrigin.getLongitude()
        ) / 1000.0;

        double destDistKm = OsrmRouteService.calculateHaversineMeters(
                reqDestination.getLatitude(), reqDestination.getLongitude(),
                tripDestination.getLatitude(), tripDestination.getLongitude()
        ) / 1000.0;

        if (originDistKm <= maxOriginDistanceKm && destDistKm <= maxDestinationDistanceKm) {
            return true;
        }

        // 3. Coincidencia por Corredor / Paradas Intermedias de Paso
        // Calculamos la proyección y desvío de reqOrigin y reqDestination a lo largo del trayecto tripOrigin -> tripDestination
        CorridorPoint origCorr = projectOntoCorridor(reqOrigin, tripOrigin, tripDestination);
        CorridorPoint destCorr = projectOntoCorridor(reqDestination, tripOrigin, tripDestination);

        // Ambos puntos deben estar dentro del corredor con desvío aceptable (máx 3.5 km de la traza)
        if (origCorr.deviationKm <= maxCorridorDeviationKm && destCorr.deviationKm <= maxCorridorDeviationKm) {
            // El origen debe ocurrir antes del destino en el sentido del viaje
            if (origCorr.progress < destCorr.progress - 0.04 && origCorr.progress >= -0.20 && destCorr.progress <= 1.20) {
                return true;
            }
        }

        return false;
    }

    public static class CorridorPoint {
        public final double progress; // 0.0 = en el origen del viaje, 1.0 = en el destino del viaje
        public final double deviationKm; // Distancia perpendicular a la línea directa de la ruta

        public CorridorPoint(double progress, double deviationKm) {
            this.progress = progress;
            this.deviationKm = deviationKm;
        }
    }

    public static CorridorPoint projectOntoCorridor(Location p, Location a, Location b) {
        if (p == null || a == null || b == null) {
            return new CorridorPoint(0.0, 999.0);
        }

        double dLat = b.getLatitude() - a.getLatitude();
        double dLon = b.getLongitude() - a.getLongitude();
        double lenSq = dLat * dLat + dLon * dLon;

        if (lenSq < 1e-9) {
            double dist = OsrmRouteService.calculateHaversineMeters(p.getLatitude(), p.getLongitude(), a.getLatitude(), a.getLongitude()) / 1000.0;
            return new CorridorPoint(0.0, dist);
        }

        double apLat = p.getLatitude() - a.getLatitude();
        double apLon = p.getLongitude() - a.getLongitude();

        double t = (apLat * dLat + apLon * dLon) / lenSq;
        double clampedT = Math.max(0.0, Math.min(1.0, t));
        double projLat = a.getLatitude() + clampedT * dLat;
        double projLon = a.getLongitude() + clampedT * dLon;

        double deviationKm = OsrmRouteService.calculateHaversineMeters(p.getLatitude(), p.getLongitude(), projLat, projLon) / 1000.0;
        return new CorridorPoint(t, deviationKm);
    }

    private long calculateTimeDifferenceMinutes(String timeStr1, String timeStr2) {
        try {
            LocalDateTime dt1 = parseDateTime(timeStr1);
            LocalDateTime dt2 = parseDateTime(timeStr2);
            return ChronoUnit.MINUTES.between(dt1, dt2);
        } catch (Exception e) {
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

    public double getMaxDepartureTimeDiffMinutes() {
        return maxDepartureTimeDiffMinutes;
    }

    public int getVehicleCapacity() {
        return vehicleCapacity;
    }
}

