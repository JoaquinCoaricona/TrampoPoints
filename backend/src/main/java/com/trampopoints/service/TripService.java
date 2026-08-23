package com.trampopoints.service;

import com.trampopoints.dto.*;
import com.trampopoints.model.Location;
import com.trampopoints.model.Stop;
import com.trampopoints.model.Trip;
import com.trampopoints.model.TripRequest;
import com.trampopoints.model.Driver;
import com.trampopoints.model.Vehicle;
import com.trampopoints.repository.TripRepository;
import com.trampopoints.repository.TripRequestRepository;
import com.trampopoints.repository.DriverRepository;
import com.trampopoints.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TripService {

    private final MatchingService matchingService;
    private final RouteService routeService;
    private final TripRequestRepository tripRequestRepository;
    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    // Almacén en memoria de viajes y solicitudes (sincronizados con DB)
    private final Map<String, Trip> tripsMap = new ConcurrentHashMap<>();
    private final Map<String, TripRequest> requestsMap = new ConcurrentHashMap<>();
    
    private final AtomicInteger requestCounter = new AtomicInteger(100);
    private final AtomicInteger tripCounter = new AtomicInteger(450);

    @Autowired
    public TripService(
            MatchingService matchingService,
            RouteService routeService,
            TripRequestRepository tripRequestRepository,
            TripRepository tripRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository) {
        this.matchingService = matchingService;
        this.routeService = routeService;
        this.tripRequestRepository = tripRequestRepository;
        this.tripRepository = tripRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        
        loadDatabaseData();
        initMockData();
    }

    private void loadDatabaseData() {
        // Carga de base de datos a los mapas en memoria en el inicio de la app
        try {
            List<TripRequest> reqs = tripRequestRepository.findAll();
            for (TripRequest req : reqs) {
                requestsMap.put(req.getRequestId(), req);
            }
            List<Trip> tripsList = tripRepository.findAll();
            for (Trip t : tripsList) {
                tripsMap.put(t.getTripId(), t);
            }
        } catch (Exception e) {
            System.err.println("Advertencia al cargar datos de base de datos a memoria: " + e.getMessage());
        }
    }

    private void initMockData() {
        // Sin datos precargados; la base de datos PostgreSQL inicia vacía
    }

    public TripRequestResponseDto createTripRequest(TripRequestDto requestDto, String userEmail) {
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
        newRequest.setUserEmail(userEmail);

        requestsMap.put(newRequestId, newRequest);
        tripRequestRepository.save(newRequest);

        return new TripRequestResponseDto(
                newRequestId,
                "SEARCHING",
                "Solicitud creada con éxito. Buscando combis compatibles cercanas..."
        );
    }

    public MatchResponseDto findMatches(String requestId) {
        // Sincronizar desde DB para asegurar que leemos los datos actualizados
        TripRequest req = tripRequestRepository.findById(requestId).orElse(requestsMap.get(requestId));
        List<TripMatchDto> matches = new ArrayList<>();

        if (req != null) {
            // Buscamos viajes activos en la base de datos
            List<Trip> activeTrips = tripRepository.findAll();
            boolean foundAssigned = false;

            // Si está confirmado o ya fue asignado, buscamos el viaje que lo contiene
            for (Trip trip : activeTrips) {
                for (Stop stop : trip.getStops()) {
                    boolean coordsMatch = stop.getLatitude() != null && req.getOrigin().getLatitude() != null &&
                            Math.abs(stop.getLatitude() - req.getOrigin().getLatitude()) < 0.0001 &&
                            stop.getLongitude() != null && req.getOrigin().getLongitude() != null &&
                            Math.abs(stop.getLongitude() - req.getOrigin().getLongitude()) < 0.0001;
                    
                    boolean addressMatches = stop.getAddress() != null && req.getOrigin().getAddress() != null &&
                            stop.getAddress().equalsIgnoreCase(req.getOrigin().getAddress());

                    if ("PICKUP".equals(stop.getType()) && (coordsMatch || addressMatches)) {
                        matches.add(new TripMatchDto(
                                trip.getTripId(),
                                trip.getPassengerCount(),
                                trip.getCapacity(),
                                trip.getEstimatedPricePerPassenger(),
                                trip.getEstimatedSavingsPercent(),
                                trip.getDepartureTime()
                        ));
                        foundAssigned = true;
                        break;
                    }
                }
                if (foundAssigned) {
                    break;
                }
            }

            // Si no encontramos un viaje asignado directo, buscamos compatibles
            if (!foundAssigned) {
                for (Trip trip : activeTrips) {
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
            }
        }

        return new MatchResponseDto(requestId, matches);
    }

    public TripResponseDto getTripById(String tripId) {
        Trip trip = tripRepository.findById(tripId).orElse(tripsMap.get(tripId));
        if (trip == null) {
            return null;
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

        TripResponseDto response = new TripResponseDto(
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

        if (trip.getDriverId() != null) {
            Optional<Driver> driverOpt = driverRepository.findById(trip.getDriverId());
            if (driverOpt.isPresent()) {
                response.setDriver(mapToDriverDto(driverOpt.get()));
                Optional<Vehicle> vehicleOpt = vehicleRepository.findByDriverId(trip.getDriverId());
                if (vehicleOpt.isPresent()) {
                    response.setVehicle(mapToVehicleDto(vehicleOpt.get()));
                }
            }
        }

        return response;
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
        return tripRequestRepository.findAll();
    }

    public Map<String, Object> processGroupingAlgorithm() {
        // Consultar directamente de base de datos las solicitudes buscando grupo
        List<TripRequest> searching = new ArrayList<>();
        for (TripRequest r : tripRequestRepository.findAll()) {
            if ("SEARCHING".equals(r.getStatus())) {
                searching.add(r);
            }
        }

        List<Trip> createdTrips = new ArrayList<>();
        List<TripRequest> unassigned = new ArrayList<>(searching);
        List<TripRequest> skipped = new ArrayList<>();

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

            // Buscar chofer disponible
            Driver availableDriver = findFirstAvailableDriver(createdTrips);
            if (availableDriver == null) {
                // No hay chofer disponible, se skipea este grupo (permanecen en SEARCHING)
                skipped.addAll(cluster);
                continue;
            }

            Trip newTrip = createDynamicTripFromCluster(cluster);
            newTrip.setDriverId(availableDriver.getId());
            tripRepository.save(newTrip); // Persistir combi generada
            tripsMap.put(newTrip.getTripId(), newTrip);
            createdTrips.add(newTrip);

            for (TripRequest r : cluster) {
                r.setStatus("CONFIRMED");
            }
            tripRequestRepository.saveAll(cluster); // Actualizar estado de solicitudes a CONFIRMED en DB
            for (TripRequest r : cluster) {
                requestsMap.put(r.getRequestId(), r);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("processedCount", searching.size() - skipped.size());
        result.put("tripsCreatedCount", createdTrips.size());
        result.put("trips", createdTrips);
        result.put("message", "Se agruparon " + (searching.size() - skipped.size()) + " solicitudes afines en " + createdTrips.size() + " combis." +
                (skipped.size() > 0 ? " Se omitieron " + skipped.size() + " solicitudes por falta de choferes disponibles." : ""));
        return result;
    }

    private Driver findFirstAvailableDriver(List<Trip> createdTrips) {
        try {
            List<Driver> activeDrivers = driverRepository.findAll();
            for (Driver driver : activeDrivers) {
                if ("ACTIVE".equalsIgnoreCase(driver.getStatus())) {
                    // Check if driver is already assigned to a CONFIRMED trip in DB
                    boolean isAssigned = false;
                    for (Trip trip : tripRepository.findAll()) {
                        if ("CONFIRMED".equalsIgnoreCase(trip.getStatus()) && driver.getId().equals(trip.getDriverId())) {
                            isAssigned = true;
                            break;
                        }
                    }
                    // Check if driver is already assigned in newly created trips in this run
                    if (!isAssigned) {
                        for (Trip trip : createdTrips) {
                            if (driver.getId().equals(trip.getDriverId())) {
                                isAssigned = true;
                                break;
                            }
                        }
                    }
                    if (!isAssigned) {
                        return driver;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error al buscar chofer disponible: " + e.getMessage());
        }
        return null;
    }

    private DriverDto mapToDriverDto(Driver driver) {
        return new DriverDto(
                driver.getId(),
                driver.getName(),
                driver.getLastName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getAvatarUrl(),
                driver.getStatus(),
                driver.getRatingAverage(),
                driver.getTotalRatings(),
                driver.getTripsCompleted()
        );
    }

    private VehicleDto mapToVehicleDto(Vehicle vehicle) {
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getDriverId(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getColor(),
                vehicle.getLicensePlate(),
                vehicle.getImageUrl(),
                vehicle.getVehicleType(),
                vehicle.getPassengerCapacity(),
                vehicle.getSeatCount(),
                vehicle.getLuggageCapacity(),
                vehicle.getApproxCargoKg(),
                vehicle.getAllowsBulkyObjects(),
                new ArrayList<>(vehicle.getFeatures()),
                vehicle.getStatus()
        );
    }

    public boolean deleteTripRequest(String requestId, UserDto user) {
        TripRequest req = tripRequestRepository.findById(requestId).orElse(requestsMap.get(requestId));
        if (req == null) {
            return false;
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        boolean isOwner = req.getUserEmail() != null && req.getUserEmail().equalsIgnoreCase(user.getEmail());

        if (!isAdmin && !isOwner) {
            return false;
        }

        requestsMap.remove(requestId);
        tripRequestRepository.delete(req);
        return true;
    }
}
