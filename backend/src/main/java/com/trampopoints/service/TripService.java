package com.trampopoints.service;

import com.trampopoints.dto.*;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;
import com.trampopoints.model.Trip;
import com.trampopoints.model.TripRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TripService {

    private final Map<String, TripRequest> requestsMap = new ConcurrentHashMap<>();
    private final Map<String, Trip> tripsMap = new ConcurrentHashMap<>();
    private final AtomicInteger requestCounter = new AtomicInteger(100);
    private final AtomicInteger tripCounter = new AtomicInteger(456);

    private final MatchingService matchingService;
    private final RouteService routeService;

    @Autowired
    public TripService(MatchingService matchingService, RouteService routeService) {
        this.matchingService = matchingService;
        this.routeService = routeService;
        initMockData();
    }

    private void initMockData() {
        // Pre-sembrar el viaje predeterminado trip-456 de la especificación
        Location obelisco = new Location(-34.6037, -58.3816, "Obelisco");
        Location palermo = new Location(-34.5895, -58.3974, "Palermo");
        
        List<Stop> stops = new ArrayList<>();
        stops.add(new Stop("stop-1", "PICKUP", 1, -34.6037, -58.3816, "Obelisco"));
        stops.add(new Stop("stop-2", "PICKUP", 2, -34.6001, -58.3900, "Parada 2"));
        stops.add(new Stop("stop-3", "DROPOFF", 3, -34.5895, -58.3974, "Palermo"));

        String polyline = routeService.generatePolyline(obelisco, stops, palermo);

        Trip trip456 = new Trip(
                "trip-456",
                "CONFIRMED",
                12,
                30,
                1800,
                35,
                "2026-08-22T08:30:00",
                obelisco,
                palermo,
                8500,
                1800,
                polyline,
                stops
        );
        tripsMap.put(trip456.getTripId(), trip456);

        // Pre-sembrar la solicitud req-123
        TripRequest req123 = new TripRequest("req-123", obelisco, palermo, "2026-08-22T08:30:00");
        requestsMap.put(req123.getRequestId(), req123);
    }

    public TripRequestResponseDto createTripRequest(TripRequestDto dto) {
        String requestId = "req-" + requestCounter.incrementAndGet();
        
        Location origin = new Location(
                dto.getOrigin().getLatitude(),
                dto.getOrigin().getLongitude(),
                dto.getOrigin().getAddress() != null ? dto.getOrigin().getAddress() : "Origen (" + dto.getOrigin().getLatitude() + ", " + dto.getOrigin().getLongitude() + ")"
        );
        
        Location destination = new Location(
                dto.getDestination().getLatitude(),
                dto.getDestination().getLongitude(),
                dto.getDestination().getAddress() != null ? dto.getDestination().getAddress() : "Destino (" + dto.getDestination().getLatitude() + ", " + dto.getDestination().getLongitude() + ")"
        );

        TripRequest req = new TripRequest(requestId, origin, destination, dto.getDepartureTime());
        requestsMap.put(requestId, req);

        return new TripRequestResponseDto(requestId, "SEARCHING", "Buscando pasajeros compatibles");
    }

    public MatchResponseDto findMatches(String requestId) {
        TripRequest req = requestsMap.get(requestId);
        List<TripMatchDto> matches = new ArrayList<>();

        if (req != null) {
            // Buscar entre los viajes existentes compatibles
            for (Trip trip : tripsMap.values()) {
                if (matchingService.isCompatible(
                        req.getOrigin(), req.getDestination(), req.getDepartureTime(),
                        trip.getOrigin(), trip.getDestination(), trip.getDepartureTime(),
                        trip.getPassengerCount()
                )) {
                    matches.add(new TripMatchDto(
                            trip.getTripId(),
                            trip.getPassengerCount(),
                            trip.getCapacity(),
                            trip.getEstimatedPricePerPassenger(),
                            trip.getEstimatedSavingsPercent(),
                            trip.getDepartureTime()
                    ));
                }
            }

            // Si no hubo coincidencia directa, generar una nueva propuesta de viaje compartida para la solicitud
            if (matches.isEmpty()) {
                Trip newTrip = createDynamicSharedTrip(req);
                tripsMap.put(newTrip.getTripId(), newTrip);
                matches.add(new TripMatchDto(
                        newTrip.getTripId(),
                        newTrip.getPassengerCount(),
                        newTrip.getCapacity(),
                        newTrip.getEstimatedPricePerPassenger(),
                        newTrip.getEstimatedSavingsPercent(),
                        newTrip.getDepartureTime()
                ));
            }
        } else {
            // Si el requestId es req-123 o genérico sin registrar, retornar el viaje mock trip-456
            Trip trip = tripsMap.get("trip-456");
            if (trip != null) {
                matches.add(new TripMatchDto(
                        trip.getTripId(),
                        trip.getPassengerCount(),
                        trip.getCapacity(),
                        trip.getEstimatedPricePerPassenger(),
                        trip.getEstimatedSavingsPercent(),
                        trip.getDepartureTime()
                ));
            }
        }

        return new MatchResponseDto(requestId, matches);
    }

    public TripResponseDto getTripById(String tripId) {
        Trip trip = tripsMap.get(tripId);
        if (trip == null) {
            // Fallback a trip-456 si no existe
            trip = tripsMap.get("trip-456");
        }

        RouteDto routeDto = new RouteDto(
                trip.getDistanceMeters(),
                trip.getDurationSeconds(),
                trip.getPolyline()
        );

        List<StopDto> stopDtos = new ArrayList<>();
        for (Stop s : trip.getStops()) {
            stopDtos.add(new StopDto(
                    s.getStopId(),
                    s.getType(),
                    s.getOrder(),
                    s.getLatitude(),
                    s.getLongitude(),
                    s.getAddress()
            ));
        }

        return new TripResponseDto(
                trip.getTripId(),
                trip.getStatus(),
                trip.getPassengerCount(),
                trip.getCapacity(),
                trip.getEstimatedPricePerPassenger(),
                trip.getEstimatedSavingsPercent(),
                trip.getDepartureTime(),
                routeDto,
                stopDtos
        );
    }

    private Trip createDynamicSharedTrip(TripRequest req) {
        String newTripId = "trip-" + tripCounter.incrementAndGet();
        
        // Calcular puntos de parada intermedios simulando pasajeros compatibles cercanos
        double midLat = (req.getOrigin().getLatitude() + req.getDestination().getLatitude()) / 2.0;
        double midLng = (req.getOrigin().getLongitude() + req.getDestination().getLongitude()) / 2.0;

        List<Stop> stops = new ArrayList<>();
        stops.add(new Stop("stop-1", "PICKUP", 1, req.getOrigin().getLatitude(), req.getOrigin().getLongitude(), req.getOrigin().getAddress()));
        stops.add(new Stop("stop-2", "PICKUP", 2, midLat, midLng, "Parada Intermedia de Grupo"));
        stops.add(new Stop("stop-3", "DROPOFF", 3, req.getDestination().getLatitude(), req.getDestination().getLongitude(), req.getDestination().getAddress()));

        int dist = routeService.calculateDistanceMeters(req.getOrigin(), req.getDestination());
        int dur = routeService.calculateDurationSeconds(dist);
        String polyline = routeService.generatePolyline(req.getOrigin(), stops, req.getDestination());

        int passengerCount = 8 + (int)(Math.random() * 8); // 8-15 pasajeros
        int estimatedPrice = Math.max(1200, (int)(dist * 0.25));
        int savings = 30 + (int)(Math.random() * 15);

        return new Trip(
                newTripId,
                "CONFIRMED",
                passengerCount,
                matchingService.getVehicleCapacity(),
                estimatedPrice,
                savings,
                req.getDepartureTime(),
                req.getOrigin(),
                req.getDestination(),
                dist,
                dur,
                polyline,
                stops
        );
    }
}
