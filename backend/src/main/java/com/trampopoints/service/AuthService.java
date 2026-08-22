package com.trampopoints.service;

import com.trampopoints.dto.AuthResponseDto;
import com.trampopoints.dto.LoginRequestDto;
import com.trampopoints.dto.RegisterRequestDto;
import com.trampopoints.dto.UserDto;
import com.trampopoints.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private final Map<String, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, String> emailToUserId = new ConcurrentHashMap<>();
    private final Map<String, String> tokenToUserId = new ConcurrentHashMap<>();
    private final AtomicInteger userCounter = new AtomicInteger(100);

    private final PasswordSecurityService securityService;

    @Autowired
    public AuthService(PasswordSecurityService securityService) {
        this.securityService = securityService;
        initDefaultUser();
    }

    /**
     * Pre-siembra de usuario demo para pruebas inmediatas.
     */
    private void initDefaultUser() {
        String defaultUserId = "usr-101";
        String email = "juan@email.com";
        String salt = securityService.generateSalt();
        String hash = securityService.hashPassword("password123", salt);

        User defaultUser = new User(defaultUserId, "Juan Pérez", email, hash, salt);
        usersById.put(defaultUserId, defaultUser);
        emailToUserId.put(email.toLowerCase().trim(), defaultUserId);
    }

    /**
     * Registro de un nuevo usuario con validaciones de email, contraseña y unicidad.
     */
    public AuthResponseDto register(RegisterRequestDto request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ingresado no es válido");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (emailToUserId.containsKey(normalizedEmail)) {
            throw new IllegalStateException("Ya existe una cuenta registrada con este correo electrónico");
        }

        String userId = "usr-" + userCounter.incrementAndGet();
        String salt = securityService.generateSalt();
        String hash = securityService.hashPassword(request.getPassword(), salt);

        User newUser = new User(userId, request.getName().trim(), normalizedEmail, hash, salt);
        usersById.put(userId, newUser);
        emailToUserId.put(normalizedEmail, userId);

        String token = securityService.generateAuthToken();
        tokenToUserId.put(token, userId);

        UserDto userDto = new UserDto(newUser.getId(), newUser.getName(), newUser.getEmail());
        return new AuthResponseDto(token, userDto);
    }

    /**
     * Inicio de sesión validando credenciales y generando token de sesión.
     */
    public AuthResponseDto login(LoginRequestDto request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        String normalizedEmail = request.getEmail().toLowerCase().trim();
        String userId = emailToUserId.get(normalizedEmail);

        if (userId == null) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        User user = usersById.get(userId);
        if (user == null || !securityService.verifyPassword(request.getPassword(), user.getPasswordHash(), user.getSalt())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String token = securityService.generateAuthToken();
        tokenToUserId.put(token, userId);

        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail());
        return new AuthResponseDto(token, userDto);
    }

    /**
     * Obtiene los datos del usuario autenticado a partir de su token de sesión.
     */
    public UserDto getCurrentUser(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }

        String cleanToken = cleanBearerToken(token);
        String userId = tokenToUserId.get(cleanToken);

        if (userId == null) {
            return null;
        }

        User user = usersById.get(userId);
        if (user == null) {
            return null;
        }

        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }

    /**
     * Cierra la sesión eliminando el token activo.
     */
    public boolean logout(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        String cleanToken = cleanBearerToken(token);
        return tokenToUserId.remove(cleanToken) != null;
    }

    private String cleanBearerToken(String token) {
        if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            return token.substring(7).trim();
        }
        return token.trim();
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }
}
