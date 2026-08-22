package com.trampopoints.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trampopoints.dto.SaveDocumentationRequestDto;
import com.trampopoints.dto.SaveVehicleRequestDto;
import com.trampopoints.dto.UpdateDriverRequestDto;
import com.trampopoints.dto.UpdateVehicleStatusRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DriverControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Debe obtener el dashboard completo del chofer")
    void testGetDashboard() throws Exception {
        mockMvc.perform(get("/api/drivers/current/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driver.id").value("drv-101"))
                .andExpect(jsonPath("$.ratingSummary.ratingAverage").value(4.8))
                .andExpect(jsonPath("$.validDocsCount").isNumber())
                .andExpect(jsonPath("$.topRecommendations").isArray());
    }


    @Test
    @DisplayName("Debe obtener y actualizar el perfil del chofer")
    void testGetAndUpdateDriverProfile() throws Exception {
        mockMvc.perform(get("/api/drivers/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("juan.chofer@trampopoints.com"));

        UpdateDriverRequestDto updateDto = new UpdateDriverRequestDto(
                "Juan Carlos",
                "Pérez Gómez",
                "juan.carlos@trampopoints.com",
                "+54 11 9999-8888",
                "https://example.com/new-avatar.jpg"
        );

        mockMvc.perform(put("/api/drivers/current")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Juan Carlos"))
                .andExpect(jsonPath("$.lastName").value("Pérez Gómez"))
                .andExpect(jsonPath("$.phone").value("+54 11 9999-8888"));
    }

    @Test
    @DisplayName("Debe guardar y actualizar datos del vehículo")
    void testSaveVehicleAndChangeStatus() throws Exception {
        SaveVehicleRequestDto vehicleDto = new SaveVehicleRequestDto(
                "Iveco",
                "Daily Minibús",
                2025,
                "Gris Plata",
                "AG 999 ZZ",
                "MINIBUS",
                24,
                24,
                "LARGE",
                1000,
                true,
                Arrays.asList("AIRE_ACONDICIONADO", "WIFI", "USB"),
                "AVAILABLE"
        );

        mockMvc.perform(post("/api/drivers/current/vehicle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicleDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("Iveco"))
                .andExpect(jsonPath("$.model").value("Daily Minibús"))
                .andExpect(jsonPath("$.passengerCapacity").value(24));

        // Cambiar estado a UNAVAILABLE
        UpdateVehicleStatusRequestDto statusDto = new UpdateVehicleStatusRequestDto("UNAVAILABLE");
        mockMvc.perform(put("/api/drivers/current/vehicle/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UNAVAILABLE"));
    }

    @Test
    @DisplayName("Debe gestionar la documentación del vehículo")
    void testVehicleDocumentationCrud() throws Exception {
        // Listar
        mockMvc.perform(get("/api/drivers/current/vehicle/documentations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // Guardar nuevo doc
        SaveDocumentationRequestDto newDoc = new SaveDocumentationRequestDto(
                null,
                "SEGURO",
                "Póliza de Seguro de Flota 2026-2027",
                "POL-TEST-12345",
                "Sancor Seguros",
                LocalDate.now(),
                LocalDate.now().plusYears(1),
                "VALID",
                "Póliza renovada sin siniestros"
        );

        mockMvc.perform(post("/api/drivers/current/vehicle/documentations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newDoc)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentNumber").value("POL-TEST-12345"))
                .andExpect(jsonPath("$.status").value("VALID"));
    }

    @Test
    @DisplayName("Debe consultar calificaciones y recomendaciones")
    void testRatingsAndRecommendations() throws Exception {
        mockMvc.perform(get("/api/drivers/current/ratings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ratingAverage").value(4.8))
                .andExpect(jsonPath("$.fiveStars").value(87))
                .andExpect(jsonPath("$.recentRatings").isArray());

        mockMvc.perform(get("/api/drivers/current/recommendations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].quote").isNotEmpty());
    }
}
