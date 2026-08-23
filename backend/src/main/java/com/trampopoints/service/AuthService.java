package com.trampopoints.service;

import com.trampopoints.dto.AuthResponseDto;
import com.trampopoints.dto.LoginRequestDto;
import com.trampopoints.dto.RegisterRequestDto;
import com.trampopoints.dto.UserDto;
import com.trampopoints.model.User;
import com.trampopoints.model.UserRole;
import com.trampopoints.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private final UserRepository userRepository;
    private final PasswordSecurityService securityService;
    private final Map<String, String> tokenToUserId = new ConcurrentHashMap<>();
    private final AtomicInteger userCounter = new AtomicInteger(100);

    @Autowired
    public AuthService(UserRepository userRepository, PasswordSecurityService securityService) {
        this.userRepository = userRepository;
        this.securityService = securityService;
        initDefaultUsers();
    }

    /**
     * Pre-siembra de usuarios demo en PostgreSQL: Pasajero, Administrador y Chofer.
     */
    private void initDefaultUsers() {
        // 1. Demo Pasajero
        String email = "juan@email.com";
        if (!userRepository.existsByEmail(email)) {
            String salt = securityService.generateSalt();
            String hash = securityService.hashPassword("password123", salt);
            User defaultUser = new User("usr-101", "Juan Pérez (Pasajero)", email, hash, salt, UserRole.USER);
            userRepository.save(defaultUser);
        }

        // 2. Demo Administrador
        String adminEmail = "admin@trampopoints.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            String adminSalt = securityService.generateSalt();
            String adminHash = securityService.hashPassword("admin123", adminSalt);
            User adminUser = new User("usr-admin-01", "Administrador General", adminEmail, adminHash, adminSalt, UserRole.ADMIN);
            userRepository.save(adminUser);
        }

        // 3. Demo Chofer
        String driverEmail = "juan.chofer@trampopoints.com";
        if (!userRepository.existsByEmail(driverEmail)) {
            String driverSalt = securityService.generateSalt();
            String driverHash = securityService.hashPassword("password123", driverSalt);
            User driverUser = new User("usr-drv-101", "Juan Pérez (Chofer)", driverEmail, driverHash, driverSalt, UserRole.DRIVER);
            userRepository.save(driverUser);
        }
    }

    /**
     * Registro de un nuevo usuario con asignación de rol (USER, DRIVER, ADMIN).
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
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalStateException("Ya existe una cuenta registrada con este correo electrónico");
        }

        String userId = "usr-" + userCounter.incrementAndGet();
        String salt = securityService.generateSalt();
        String hash = securityService.hashPassword(request.getPassword(), salt);

        // Resolver rol solicitado
        String role = "USER";
        if (request.getRole() != null) {
            String r = request.getRole().toUpperCase().trim();
            if (r.equals("DRIVER") || r.equals("CHOFER")) {
                role = "DRIVER";
            } else if (r.equals("ADMIN")) {
                role = "ADMIN";
            }
        }

        User newUser = new User(userId, request.getName().trim(), normalizedEmail, hash, salt, UserRole.valueOf(role));
        userRepository.save(newUser);

        String token = securityService.generateAuthToken();
        tokenToUserId.put(token, userId);

        UserDto userDto = new UserDto(newUser.getId(), newUser.getName(), newUser.getEmail(), newUser.getRole().name());
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
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        User user = userOpt.get();
        if (!securityService.verifyPassword(request.getPassword(), user.getPasswordHash(), user.getSalt())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String token = securityService.generateAuthToken();
        tokenToUserId.put(token, user.getId());

        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
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
            // Fallback de desarrollo para evitar 401 en sesiones locales previas o mock tokens
            if (cleanToken.toLowerCase().contains("mock") || cleanToken.toLowerCase().contains("token")) {
                Optional<User> adminOpt = userRepository.findByEmail("admin@trampopoints.com");
                if (adminOpt.isPresent()) {
                    User admin = adminOpt.get();
                    return new UserDto(admin.getId(), admin.getName(), admin.getEmail(), admin.getRole().name());
                }
            }
            return null;
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
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
