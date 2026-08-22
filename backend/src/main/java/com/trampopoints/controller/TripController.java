package com.trampopoints.controller;

import com.trampopoints.dto.*;
import com.trampopoints.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(originPatterns = "*")
public class TripController {

    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    /**
     * 1. Crear solicitud de viaje
     * POST /api/trips/requests
     */
    @PostMapping("/requests")
    public ResponseEntity<TripRequestResponseDto> createTripRequest(@RequestBody TripRequestDto requestDto) {
        TripRequestResponseDto response = tripService.createTripRequest(requestDto);
        return ResponseEntity.ok(response);
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
}
