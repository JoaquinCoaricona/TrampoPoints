package com.trampopoints.controller;

import com.trampopoints.dto.RouteOptimizationRequestDto;
import com.trampopoints.dto.RouteOptimizationResponseDto;
import com.trampopoints.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(originPatterns = "*")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * 4. Crear/generar una ruta
     * POST /api/routes/optimize
     */
    @PostMapping("/optimize")
    public ResponseEntity<RouteOptimizationResponseDto> optimizeRoute(@RequestBody RouteOptimizationRequestDto requestDto) {
        RouteOptimizationResponseDto response = routeService.optimizeRoute(
                requestDto.getOrigin(),
                requestDto.getStops(),
                requestDto.getDestination()
        );
        return ResponseEntity.ok(response);
    }
}
