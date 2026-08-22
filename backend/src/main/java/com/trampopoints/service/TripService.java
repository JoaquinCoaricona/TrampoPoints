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

    private final MatchingService matchingService;
    private final RouteService routeService;

    // Almacén en memoria de viajes y solicitudes
    private final Map<String, Trip> tripsMap = new ConcurrentHashMap<>();
    private final Map<String, TripRequest> requestsMap = new ConcurrentHashMap<>();
    
    private final AtomicInteger requestCounter = new AtomicInteger(100);
    private final AtomicInteger tripCounter = new AtomicInteger(450);

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
        stops.add(new Stop("stop-2", "DROPOFF", 2, -34.5895, -58.3974, "Palermo"));

        String polyline = routeService.generatePolyline(obelisco, stops, palermo);

        Trip trip456 = new Trip(
                "trip-456",
                "CONFIRMED",
                1,
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

    public TripRequestResponseDto createTripRequest(TripRequestDto requestDto) {
        String newRequestId = "req-" + requestCounter.incrementAndGet();

        Location origin = new Location(
                requestDto.getOrigin().getLatitude(),
                requestDto.getOrigin().getLongitude(),
                requestDto.getOrigin().getAddress()
        );

        Location destination = new Location(
                requestDto.getDestination().getLatitude(),
                requestDto.getDestination().getLongitude(),
                requestDto.getDestination().getAddress()
        );

        TripRequest newRequest = new TripRequest(
                newRequestId,
                origin,
                destination,
                requestDto.getDepartureTime()
        );

        requestsMap.put(newRequestId, newRequest);

        return new TripRequestResponseDto(
                newRequestId,
                "SEARCHING",
                "Solicitud creada con éxito. Buscando combis compatibles cercanas..."
        );
    }

    public MatchResponseDto findMatches(String requestId) {
        TripRequest req = requestsMap.get(requestId);
        List<TripMatchDto> matches = new ArrayList<>();

        if (req != null) {
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
                Trip newTrip = createDynamicTripFromCluster(List.of(req));
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

    private Trip createDynamicTripFromCluster(List<TripRequest> cluster) {
        String newTripId = "trip-" + tripCounter.incrementAndGet();
        TripRequest seed = cluster.get(0);
        
        List<Stop> stops = new ArrayList<>();
        int order = 1;

        // 1. Agregar paradas de subida (PICKUP) reales para cada solicitud del grupo
        for (int i = 0; i < cluster.size(); i++) {
            TripRequest req = cluster.get(i);
            stops.add(new Stop(
                    "stop-" + newTripId + "-p" + (i + 1),
                    "PICKUP",
                    order++,
                    req.getOrigin().getLatitude(),
                    req.getOrigin().getLongitude(),
                    req.getOrigin().getAddress()
            ));
        }

        // 2. Agregar paradas de bajada (DROPOFF) reales para cada solicitud del grupo
        for (int i = 0; i < cluster.size(); i++) {
            TripRequest req = cluster.get(i);
            stops.add(new Stop(
                    "stop-" + newTripId + "-d" + (i + 1),
                    "DROPOFF",
                    order++,
                    req.getDestination().getLatitude(),
                    req.getDestination().getLongitude(),
                    req.getDestination().getAddress()
            ));
        }

        // Cantidad exacta de pasajeros asignados a esta combi
        int passengerCount = cluster.size();

        int dist = routeService.calculateDistanceMeters(seed.getOrigin(), seed.getDestination());
        int dur = routeService.calculateDurationSeconds(dist);
        String polyline = routeService.generatePolyline(seed.getOrigin(), stops, seed.getDestination());

        int estimatedPrice = Math.max(1200, (int)(dist * 0.22));
        int savings = Math.min(45, 30 + (cluster.size() * 3));

        return new Trip(
                newTripId,
                "CONFIRMED",
                passengerCount,
                matchingService.getVehicleCapacity(),
                estimatedPrice,
                savings,
                seed.getDepartureTime(),
                seed.getOrigin(),
                seed.getDestination(),
                dist,
                dur,
                polyline,
                stops
        );
    }

    public List<TripRequest> getAllRequests() {
        return new ArrayList<>(requestsMap.values());
    }

    public Map<String, Object> processGroupingAlgorithm() {
        List<TripRequest> searching = new ArrayList<>();
        for (TripRequest r : requestsMap.values()) {
            if ("SEARCHING".equals(r.getStatus())) {
                searching.add(r);
            }
        }

        List<Trip> createdTrips = new ArrayList<>();
        List<TripRequest> unassigned = new ArrayList<>(searching);

        while (!unassigned.isEmpty()) {
            TripRequest seed = unassigned.remove(0);
            List<TripRequest> cluster = new ArrayList<>();
            cluster.add(seed);

            for (int i = unassigned.size() - 1; i >= 0; i--) {
                TripRequest candidate = unassigned.get(i);
                if (matchingService.isCompatible(
                        seed.getOrigin(), seed.getDestination(), seed.getDepartureTime(),
                        candidate.getOrigin(), candidate.getDestination(), candidate.getDepartureTime(),
                        cluster.size()
                )) {
                    cluster.add(candidate);
                    unassigned.remove(i);
                }
            }

            Trip newTrip = createDynamicTripFromCluster(cluster);
            tripsMap.put(newTrip.getTripId(), newTrip);
            createdTrips.add(newTrip);

            for (TripRequest r : cluster) {
                r.setStatus("CONFIRMED");
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("processedCount", searching.size());
        result.put("tripsCreatedCount", createdTrips.size());
        result.put("trips", createdTrips);
        result.put("message", "Se agruparon " + searching.size() + " solicitudes afines en " + createdTrips.size() + " combis.");
        return result;
    }
}
