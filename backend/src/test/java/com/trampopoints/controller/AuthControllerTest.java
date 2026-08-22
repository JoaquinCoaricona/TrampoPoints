package com.trampopoints.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trampopoints.dto.LoginRequestDto;
import com.trampopoints.dto.RegisterRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Debe loguear correctamente al usuario demo pre-sembrado")
    void testLoginDemoUserSuccess() throws Exception {
        LoginRequestDto loginDto = new LoginRequestDto("juan@email.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("juan@email.com"))
                .andExpect(jsonPath("$.user.name").value("Juan Pérez"));
    }

    @Test
    @DisplayName("Debe rechazar login con contraseña incorrecta")
    void testLoginInvalidPassword() throws Exception {
        LoginRequestDto loginDto = new LoginRequestDto("juan@email.com", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales inválidas"));
    }

    @Test
    @DisplayName("Debe registrar un nuevo usuario y permitir obtener su perfil")
    void testRegisterAndGetMe() throws Exception {
        String uniqueEmail = "maria_" + System.currentTimeMillis() + "@email.com";
        RegisterRequestDto regDto = new RegisterRequestDto("María Gómez", uniqueEmail, "segura123");

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.name").value("María Gómez"))
                .andExpect(jsonPath("$.user.email").value(uniqueEmail))
                .andReturn();

        String responseJson = regResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("token").asText();

        // Validar /api/auth/me con el token obtenido
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("María Gómez"))
                .andExpect(jsonPath("$.email").value(uniqueEmail));

        // Cerrar sesión
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verificar que el token ya no sea válido tras el logout
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Debe rechazar registro con email duplicado")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequestDto regDto = new RegisterRequestDto("Otro Juan", "juan@email.com", "password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regDto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").isNotEmpty());
    }

    @Test
    @DisplayName("Debe rechazar registro con contraseña corta")
    void testRegisterShortPassword() throws Exception {
        RegisterRequestDto regDto = new RegisterRequestDto("Carlos", "carlos@email.com", "123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("La contraseña debe tener al menos 6 caracteres"));
    }
}
