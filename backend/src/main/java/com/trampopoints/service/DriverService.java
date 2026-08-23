package com.trampopoints.service;

import com.trampopoints.dto.*;
import com.trampopoints.model.*;
import com.trampopoints.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private static final String DEFAULT_DRIVER_ID = "drv-101";

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentationRepository vehicleDocumentationRepository;
    private final DriverRatingRepository driverRatingRepository;
    private final DriverRecommendationRepository driverRecommendationRepository;

    private final AtomicInteger docCounter = new AtomicInteger(10);
    private final AtomicInteger ratingCounter = new AtomicInteger(50);
    private final AtomicInteger recommendationCounter = new AtomicInteger(20);

    @Autowired
    public DriverService(
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository,
            VehicleDocumentationRepository vehicleDocumentationRepository,
            DriverRatingRepository driverRatingRepository,
            DriverRecommendationRepository driverRecommendationRepository) {
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleDocumentationRepository = vehicleDocumentationRepository;
        this.driverRatingRepository = driverRatingRepository;
        this.driverRecommendationRepository = driverRecommendationRepository;
        
        initDefaultDriverData();
    }

    private void initDefaultDriverData() {
        // 1. Chofer por defecto en base de datos
        if (!driverRepository.existsById(DEFAULT_DRIVER_ID)) {
            Driver driver = new Driver(
                    DEFAULT_DRIVER_ID,
                    "Juan",
                    "Pérez",
                    "juan.chofer@trampopoints.com",
                    "+54 11 4589-2234",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    "ACTIVE",
                    4.8,
                    103,
                    42
            );
            driverRepository.save(driver);
        }

        // 2. Vehículo en base de datos
        String vehicleId = "veh-101";
        if (!vehicleRepository.existsById(vehicleId)) {
            List<String> features = new ArrayList<>(Arrays.asList(
                    "AIRE_ACONDICIONADO",
                    "CALEFACCION",
                    "WIFI",
                    "USB",
                    "CINTURONES_SEGURIDAD",
                    "ESPACIO_EQUIPAJE",
                    "ACCESIBILIDAD_RAMPA"
            ));

            Vehicle vehicle = new Vehicle(
                    vehicleId,
                    DEFAULT_DRIVER_ID,
                    "Mercedes-Benz",
                    "Sprinter 516 CDI Minibús",
                    2024,
                    "Blanco Ártico",
                    "AF 482 TP",
                    "MINIBUS",
                    20,
                    20,
                    "LARGE",
                    850,
                    true,
                    features,
                    "AVAILABLE"
            );
            vehicle.setImageUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80");
            vehicleRepository.save(vehicle);
        }

        // 3. Documentación en base de datos
        if (vehicleDocumentationRepository.findByVehicleId(vehicleId).isEmpty()) {
            List<VehicleDocumentation> docs = new ArrayList<>();
            docs.add(new VehicleDocumentation(
                    "doc-1",
                    vehicleId,
                    "SEGURO",
                    "Seguro Obligatorio y Responsabilidad Civil Pasajeros",
                    "POL-984218-AR",
                    "La Segunda Seguros",
                    LocalDate.now().minusMonths(6),
                    LocalDate.now().plusMonths(6),
                    "VALID",
                    "Cobertura integral con extensión para transporte interurbano"
            ));

            docs.add(new VehicleDocumentation(
                    "doc-2",
                    vehicleId,
                    "VTV",
                    "VTV / Revisión Técnica Obligatoria (RTO)",
                    "RTO-2026-8819",
                    "Gobierno de la Ciudad de Buenos Aires",
                    LocalDate.now().minusMonths(4),
                    LocalDate.now().plusMonths(8),
                    "VALID",
                    "Aprobado sin observaciones mecánicas ni de emisión"
            ));

            docs.add(new VehicleDocumentation(
                    "doc-3",
                    vehicleId,
                    "PATENTE",
                    "Constancia de Radicación y Título del Automotor",
                    "DOM-AF482TP",
                    "DNRPA Argentina",
                    LocalDate.of(2024, 2, 10),
                    null,
                    "VALID",
                    "Patente al día sin infracciones pendientes"
            ));

            docs.add(new VehicleDocumentation(
                    "doc-4",
                    vehicleId,
                    "LICENCIA_PROFESIONAL",
                    "Licencia Nacional de Conducir Clase D2 (Pasajeros)",
                    "LIC-34892019",
                    "Dirección General de Tránsito y Transporte",
                    LocalDate.now().minusMonths(8),
                    LocalDate.now().plusMonths(16),
                    "VALID",
                    "Habilitación profesional para transporte de pasajeros de mediana y larga distancia"
            ));
            vehicleDocumentationRepository.saveAll(docs);
        }

        // 4. Calificaciones y Comentarios en base de datos
        if (driverRatingRepository.findByDriverId(DEFAULT_DRIVER_ID).isEmpty()) {
            List<DriverRating> ratings = new ArrayList<>();
            ratings.add(new DriverRating(
                    "rate-1",
                    DEFAULT_DRIVER_ID,
                    "Sofía Mendoza",
                    5,
                    "Excelente servicio, la combi súper limpia y cómoda. Juan muy puntual y respetuoso.",
                    Arrays.asList("Puntualidad", "Vehículo Limpio", "Manejo Seguro")
            ));
            ratings.add(new DriverRating(
                    "rate-2",
                    DEFAULT_DRIVER_ID,
                    "Martín Gómez",
                    5,
                    "Muy buen viaje hacia Pilar, el aire acondicionado funcionaba perfecto y llegamos antes de lo previsto.",
                    Arrays.asList("Aire Acondicionado", "Puntualidad", "Comodidad")
            ));
            ratings.add(new DriverRating(
                    "rate-3",
                    DEFAULT_DRIVER_ID,
                    "Lucía Rossi",
                    5,
                    "Manejo seguro y profesional. Muy recomendable para viajar todos los días.",
                    Arrays.asList("Manejo Seguro", "Amabilidad")
            ));
            ratings.add(new DriverRating(
                    "rate-4",
                    DEFAULT_DRIVER_ID,
                    "Esteban Morales",
                    4,
                    "Vehículo espacioso y con cargadores USB funcionando en cada asiento. Todo de diez.",
                    Arrays.asList("USB", "Espacioso")
            ));
            ratings.add(new DriverRating(
                    "rate-5",
                    DEFAULT_DRIVER_ID,
                    "Carolina Benítez",
                    5,
                    "Muy buena coordinación de paradas y trato sumamente cordial.",
                    Arrays.asList("Puntualidad", "Amabilidad")
            ));
            driverRatingRepository.saveAll(ratings);
        }

        // 5. Recomendaciones Destacadas en base de datos
        if (driverRecommendationRepository.findByDriverId(DEFAULT_DRIVER_ID).isEmpty()) {
            List<DriverRecommendation> recs = new ArrayList<>();
            recs.add(new DriverRecommendation(
                    "rec-1",
                    DEFAULT_DRIVER_ID,
                    "Martín Gómez",
                    5,
                    "Excelente servicio y muy puntual. Es la mejor opción para traslados diarios compartidos.",
                    "Pilar ➔ Microcentro"
            ));
            recs.add(new DriverRecommendation(
                    "rec-2",
                    DEFAULT_DRIVER_ID,
                    "Lucía Rossi",
                    5,
                    "Vehículo muy cómodo, con WiFi veloz y climatización perfecta. Viaje 100% recomendable.",
                    "San Isidro ➔ Belgrano"
            ));
            recs.add(new DriverRecommendation(
                    "rec-3",
                    DEFAULT_DRIVER_ID,
                    "Esteban Morales",
                    4,
                    "Todo perfecto, muy atento con el equipaje y una conducción sumamente responsable.",
                    "Belgrano ➔ Tigre"
            ));
            driverRecommendationRepository.saveAll(recs);
        }
    }

    // ==========================================
    // MÉTODOS DEL PERFIL DEL CHOFER
    // ==========================================

    public DriverDto getCurrentDriver() {
        Driver driver = driverRepository.findById(DEFAULT_DRIVER_ID)
                .orElseGet(() -> {
                    initDefaultDriverData();
                    return driverRepository.findById(DEFAULT_DRIVER_ID).orElse(null);
                });
        return driver != null ? mapToDriverDto(driver) : null;
    }

    public DriverDto updateDriver(UpdateDriverRequestDto request) {
        Driver driver = driverRepository.findById(DEFAULT_DRIVER_ID)
                .orElseGet(() -> {
                    initDefaultDriverData();
                    return driverRepository.findById(DEFAULT_DRIVER_ID).orElse(null);
                });

        if (driver == null) {
            return null;
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            driver.setName(request.getName().trim());
        }
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            driver.setLastName(request.getLastName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            driver.setEmail(request.getEmail().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            driver.setPhone(request.getPhone().trim());
        }
        if (request.getAvatarUrl() != null) {
            driver.setAvatarUrl(request.getAvatarUrl().trim());
        }
        driver.setUpdatedAt(LocalDateTime.now());

        driverRepository.save(driver);
        return mapToDriverDto(driver);
    }

    // ==========================================
    // MÉTODOS DEL VEHÍCULO
    // ==========================================

    public VehicleDto getVehicle() {
        Vehicle vehicle = vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID)
                .orElseGet(() -> {
                    initDefaultDriverData();
                    return vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID).orElse(null);
                });
        return vehicle != null ? mapToVehicleDto(vehicle) : null;
    }

    public VehicleDto saveVehicle(SaveVehicleRequestDto request) {
        Vehicle vehicle = vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID).orElse(null);
        if (vehicle == null) {
            vehicle = new Vehicle();
            vehicle.setId("veh-" + System.currentTimeMillis());
            vehicle.setDriverId(DEFAULT_DRIVER_ID);
        }

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setColor(request.getColor());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setImageUrl(request.getImageUrl());
        vehicle.setVehicleType(request.getVehicleType() != null ? request.getVehicleType() : "MINIBUS");
        vehicle.setPassengerCapacity(request.getPassengerCapacity() != null ? request.getPassengerCapacity() : 20);
        vehicle.setSeatCount(request.getSeatCount() != null ? request.getSeatCount() : vehicle.getPassengerCapacity());
        vehicle.setLuggageCapacity(request.getLuggageCapacity() != null ? request.getLuggageCapacity() : "MEDIUM");
        vehicle.setApproxCargoKg(request.getApproxCargoKg() != null ? request.getApproxCargoKg() : 500);
        vehicle.setAllowsBulkyObjects(request.getAllowsBulkyObjects() != null ? request.getAllowsBulkyObjects() : false);
        vehicle.setFeatures(request.getFeatures() != null ? request.getFeatures() : new ArrayList<>());
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }
        vehicle.setUpdatedAt(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        return mapToVehicleDto(vehicle);
    }

    public VehicleDto updateVehicleStatus(String status) {
        Vehicle vehicle = vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID)
                .orElseGet(() -> {
                    initDefaultDriverData();
                    return vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID).orElse(null);
                });

        if (vehicle == null) {
            return null;
        }

        if ("AVAILABLE".equalsIgnoreCase(status) || "UNAVAILABLE".equalsIgnoreCase(status) || "OUT_OF_SERVICE".equalsIgnoreCase(status)) {
            vehicle.setStatus(status.toUpperCase());
            vehicle.setUpdatedAt(LocalDateTime.now());
            vehicleRepository.save(vehicle);
        } else {
            throw new IllegalArgumentException("Estado de vehículo no válido: " + status);
        }

        return mapToVehicleDto(vehicle);
    }

    // ==========================================
    // MÉTODOS DE DOCUMENTACIÓN
    // ==========================================

    public List<VehicleDocumentationDto> getVehicleDocumentations() {
        Vehicle vehicle = vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID).orElse(null);
        String vehicleId = vehicle != null ? vehicle.getId() : "veh-101";

        List<VehicleDocumentation> docs = vehicleDocumentationRepository.findByVehicleId(vehicleId);
        LocalDate today = LocalDate.now();

        return docs.stream().map(doc -> {
            Long daysUntil = null;
            String computedStatus = doc.getStatus();

            if (doc.getExpirationDate() != null) {
                daysUntil = ChronoUnit.DAYS.between(today, doc.getExpirationDate());
                if (daysUntil < 0) {
                    computedStatus = "EXPIRED";
                } else if (daysUntil <= 30) {
                    computedStatus = "PENDING_RENEWAL";
                } else {
                    computedStatus = "VALID";
                }
            }

            return new VehicleDocumentationDto(
                    doc.getId(),
                    doc.getVehicleId(),
                    doc.getDocumentType(),
                    doc.getTitle(),
                    doc.getDocumentNumber(),
                    doc.getIssuer(),
                    doc.getIssueDate(),
                    doc.getExpirationDate(),
                    computedStatus,
                    doc.getNotes(),
                    daysUntil
            );
        }).collect(Collectors.toList());
    }

    public VehicleDocumentationDto saveDocumentation(SaveDocumentationRequestDto request) {
        Vehicle vehicle = vehicleRepository.findByDriverId(DEFAULT_DRIVER_ID).orElse(null);
        String vehicleId = vehicle != null ? vehicle.getId() : "veh-101";

        VehicleDocumentation docToSave = null;
        if (request.getId() != null) {
            docToSave = vehicleDocumentationRepository.findById(request.getId()).orElse(null);
        }

        if (docToSave == null) {
            docToSave = new VehicleDocumentation();
            docToSave.setId("doc-" + docCounter.incrementAndGet());
            docToSave.setVehicleId(vehicleId);
        }

        docToSave.setDocumentType(request.getDocumentType());
        docToSave.setTitle(request.getTitle());
        docToSave.setDocumentNumber(request.getDocumentNumber());
        docToSave.setIssuer(request.getIssuer());
        docToSave.setIssueDate(request.getIssueDate());
        docToSave.setExpirationDate(request.getExpirationDate());
        docToSave.setNotes(request.getNotes());
        docToSave.setUpdatedAt(LocalDateTime.now());

        LocalDate today = LocalDate.now();
        Long daysUntil = null;
        String status = "VALID";
        if (docToSave.getExpirationDate() != null) {
            daysUntil = ChronoUnit.DAYS.between(today, docToSave.getExpirationDate());
            if (daysUntil < 0) {
                status = "EXPIRED";
            } else if (daysUntil <= 30) {
                status = "PENDING_RENEWAL";
            }
        }
        docToSave.setStatus(status);

        vehicleDocumentationRepository.save(docToSave);

        return new VehicleDocumentationDto(
                docToSave.getId(),
                docToSave.getVehicleId(),
                docToSave.getDocumentType(),
                docToSave.getTitle(),
                docToSave.getDocumentNumber(),
                docToSave.getIssuer(),
                docToSave.getIssueDate(),
                docToSave.getExpirationDate(),
                docToSave.getStatus(),
                docToSave.getNotes(),
                daysUntil
        );
    }

    public boolean deleteDocumentation(String docId) {
        if (vehicleDocumentationRepository.existsById(docId)) {
            vehicleDocumentationRepository.deleteById(docId);
            return true;
        }
        return false;
    }

    // ==========================================
    // MÉTODOS DE CALIFICACIONES Y RECOMENDACIONES
    // ==========================================

    public DriverRatingSummaryDto getRatingSummary() {
        Driver driver = driverRepository.findById(DEFAULT_DRIVER_ID).orElse(null);
        List<DriverRating> ratings = driverRatingRepository.findByDriverId(DEFAULT_DRIVER_ID);

        List<DriverRatingDto> recentDtos = ratings.stream().map(r -> new DriverRatingDto(
                r.getId(),
                r.getPassengerName(),
                r.getScore(),
                r.getComment(),
                r.getTags(),
                r.getCreatedAt()
        )).collect(Collectors.toList());

        return new DriverRatingSummaryDto(
                driver != null ? driver.getRatingAverage() : 4.8,
                driver != null ? driver.getTotalRatings() : 103,
                87, // 5 estrellas
                12, // 4 estrellas
                3,  // 3 estrellas
                1,  // 2 estrellas
                0,  // 1 estrella
                recentDtos
        );
    }

    public List<DriverRecommendationDto> getRecommendations() {
        List<DriverRecommendation> recs = driverRecommendationRepository.findByDriverId(DEFAULT_DRIVER_ID);
        return recs.stream().map(r -> new DriverRecommendationDto(
                r.getId(),
                r.getPassengerName(),
                r.getScore(),
                r.getQuote(),
                r.getTripRoute(),
                r.getCreatedAt()
        )).collect(Collectors.toList());
    }

    // ==========================================
    // DASHBOARD COMPLETO DEL CHOFER
    // ==========================================

    public DriverDashboardDto getDashboard() {
        DriverDto driverDto = getCurrentDriver();
        VehicleDto vehicleDto = getVehicle();
        DriverRatingSummaryDto ratingSummary = getRatingSummary();
        List<VehicleDocumentationDto> docs = getVehicleDocumentations();
        List<DriverRecommendationDto> recs = getRecommendations();

        int validDocs = 0;
        int expiredDocs = 0;
        for (VehicleDocumentationDto d : docs) {
            if ("EXPIRED".equalsIgnoreCase(d.getStatus())) {
                expiredDocs++;
            } else {
                validDocs++;
            }
        }

        return new DriverDashboardDto(
                driverDto,
                vehicleDto,
                ratingSummary,
                validDocs,
                expiredDocs,
                docs.size(),
                recs
        );
    }

    // ==========================================
    // HELPERS DE MAPEO
    // ==========================================

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
                vehicle.getFeatures(),
                vehicle.getStatus()
        );
    }
}
