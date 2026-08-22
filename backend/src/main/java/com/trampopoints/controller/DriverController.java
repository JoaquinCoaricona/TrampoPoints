package com.trampopoints.controller;

import com.trampopoints.dto.*;
import com.trampopoints.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(originPatterns = "*")
public class DriverController {

    private final DriverService driverService;

    @Autowired
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    /**
     * Dashboard completo del chofer
     * GET /api/drivers/current/dashboard
     */
    @GetMapping("/current/dashboard")
    public ResponseEntity<DriverDashboardDto> getDashboard() {
        DriverDashboardDto dashboard = driverService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Obtener perfil del chofer
     * GET /api/drivers/current
     */
    @GetMapping("/current")
    public ResponseEntity<DriverDto> getCurrentDriver() {
        DriverDto driver = driverService.getCurrentDriver();
        return ResponseEntity.ok(driver);
    }

    /**
     * Actualizar perfil del chofer
     * PUT /api/drivers/current
     */
    @PutMapping("/current")
    public ResponseEntity<DriverDto> updateDriver(@RequestBody UpdateDriverRequestDto request) {
        DriverDto driver = driverService.updateDriver(request);
        return ResponseEntity.ok(driver);
    }

    /**
     * Obtener datos del vehículo
     * GET /api/drivers/current/vehicle
     */
    @GetMapping("/current/vehicle")
    public ResponseEntity<VehicleDto> getVehicle() {
        VehicleDto vehicle = driverService.getVehicle();
        return ResponseEntity.ok(vehicle);
    }

    /**
     * Registrar o editar vehículo
     * POST /api/drivers/current/vehicle
     */
    @PostMapping("/current/vehicle")
    public ResponseEntity<VehicleDto> saveVehicle(@RequestBody SaveVehicleRequestDto request) {
        VehicleDto vehicle = driverService.saveVehicle(request);
        return ResponseEntity.ok(vehicle);
    }

    /**
     * Cambiar estado de disponibilidad del vehículo
     * PUT /api/drivers/current/vehicle/status
     */
    @PutMapping("/current/vehicle/status")
    public ResponseEntity<?> updateVehicleStatus(@RequestBody UpdateVehicleStatusRequestDto request) {
        try {
            VehicleDto vehicle = driverService.updateVehicleStatus(request.getStatus());
            return ResponseEntity.ok(vehicle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Listar documentación del vehículo
     * GET /api/drivers/current/vehicle/documentations
     */
    @GetMapping("/current/vehicle/documentations")
    public ResponseEntity<List<VehicleDocumentationDto>> getDocumentations() {
        List<VehicleDocumentationDto> docs = driverService.getVehicleDocumentations();
        return ResponseEntity.ok(docs);
    }

    /**
     * Guardar o editar un documento
     * POST /api/drivers/current/vehicle/documentations
     */
    @PostMapping("/current/vehicle/documentations")
    public ResponseEntity<VehicleDocumentationDto> saveDocumentation(@RequestBody SaveDocumentationRequestDto request) {
        VehicleDocumentationDto doc = driverService.saveDocumentation(request);
        return ResponseEntity.ok(doc);
    }

    /**
     * Eliminar un documento
     * DELETE /api/drivers/current/vehicle/documentations/{docId}
     */
    @DeleteMapping("/current/vehicle/documentations/{docId}")
    public ResponseEntity<?> deleteDocumentation(@PathVariable String docId) {
        boolean deleted = driverService.deleteDocumentation(docId);
        return ResponseEntity.ok(Map.of("success", deleted));
    }

    /**
     * Obtener resumen y lista de calificaciones
     * GET /api/drivers/current/ratings
     */
    @GetMapping("/current/ratings")
    public ResponseEntity<DriverRatingSummaryDto> getRatings() {
        DriverRatingSummaryDto ratings = driverService.getRatingSummary();
        return ResponseEntity.ok(ratings);
    }

    /**
     * Obtener recomendaciones de pasajeros
     * GET /api/drivers/current/recommendations
     */
    @GetMapping("/current/recommendations")
    public ResponseEntity<List<DriverRecommendationDto>> getRecommendations() {
        List<DriverRecommendationDto> recs = driverService.getRecommendations();
        return ResponseEntity.ok(recs);
    }
}
