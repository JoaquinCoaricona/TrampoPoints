package com.trampopoints.controller;

import com.trampopoints.dto.*;
import com.trampopoints.model.TripRequest;
import com.trampopoints.service.TripService;
import com.trampopoints.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(originPatterns = "*")
public class TripController {

    private final TripService tripService;
    private final AuthService authService;

    @Autowired
    public TripController(TripService tripService, AuthService authService) {
        this.tripService = tripService;
        this.authService = authService;
    }

    /**
     * 1. Crear solicitud de viaje
     * POST /api/trips/requests
     */
    @PostMapping("/requests")
    public ResponseEntity<?> createTripRequest(
            @RequestBody TripRequestDto requestDto,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        String userEmail = "invitado@trampopoints.com";
        if (authHeader != null && !authHeader.trim().isEmpty()) {
            UserDto user = authService.getCurrentUser(authHeader);
            if (user != null) {
                String role = user.getRole();
                if ("ADMIN".equalsIgnoreCase(role) || "DRIVER".equalsIgnoreCase(role)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Los administradores y choferes no pueden crear solicitudes de viaje."));
                }
                userEmail = user.getEmail();
            }
        }
        
        TripRequestResponseDto response = tripService.createTripRequest(requestDto, userEmail);
        return ResponseEntity.ok(response);
    }


    /**
     * 1b. Obtener todas las solicitudes (panel de administración)
     * GET /api/trips/requests/all
     */
    @GetMapping("/requests/all")
    public ResponseEntity<List<TripRequest>> getAllRequests() {
        List<TripRequest> requests = tripService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * 1c. Ejecutar algoritmo de agrupamiento y optimización de rutas
     * POST /api/trips/process-grouping
     */
    @PostMapping("/process-grouping")
    public ResponseEntity<Map<String, Object>> processGrouping() {
        Map<String, Object> result = tripService.processGroupingAlgorithm();
        return ResponseEntity.ok(result);
    }

    /**
     * 2. Buscar viajes compatibles
     * GET /api/trips/matches/{requestId}
     */
    @GetMapping("/matches/{requestId}")
    public ResponseEntity<MatchResponseDto> getMatches(@PathVariable String requestId) {
        MatchResponseDto response = tripService.findMatches(requestId);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. Obtener un viaje
     * GET /api/trips/{tripId}
     */
    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponseDto> getTrip(@PathVariable String tripId) {
        TripResponseDto response = tripService.getTripById(tripId);
        return ResponseEntity.ok(response);
    }

    /**
     * 1d. Eliminar solicitud de viaje
     * DELETE /api/trips/requests/{requestId}
     */
    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<?> deleteTripRequest(
            @PathVariable String requestId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autorizado."));
        }
        
        UserDto user = authService.getCurrentUser(authHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sesión inválida o expirada."));
        }
        
        boolean deleted = tripService.deleteTripRequest(requestId, user);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Solicitud eliminada con éxito."));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No tienes permisos para eliminar esta solicitud o no fue encontrada."));
        }
    }

    /**
     * 1e. Obtener cantidad de combis/choferes disponibles
     * GET /api/trips/available-combis
     */
    @GetMapping("/available-combis")
    public ResponseEntity<Map<String, Object>> getAvailableCombis() {
        Map<String, Object> info = tripService.getAvailableCombisInfo();
        return ResponseEntity.ok(info);
    }
}


