package com.trampopoints.service;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

@Service
public class PasswordSecurityService {

    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Genera un salt criptográficamente seguro codificado en Base64.
     */
    public String generateSalt() {
        byte[] salt = new byte[16];
        secureRandom.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    /**
     * Hashea la contraseña utilizando PBKDF2WithHmacSHA256 y el salt provisto.
     */
    public String hashPassword(String password, String saltBase64) {
        try {
            byte[] salt = Base64.getDecoder().decode(saltBase64);
            KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Error al hashear contraseña de forma segura", e);
        }
    }

    /**
     * Verifica si la contraseña provista coincide con el hash almacenado.
     */
    public boolean verifyPassword(String rawPassword, String storedHash, String storedSalt) {
        String computedHash = hashPassword(rawPassword, storedSalt);
        return java.security.MessageDigest.isEqual(
                computedHash.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                storedHash.getBytes(java.nio.charset.StandardCharsets.UTF_8)
        );
    }

    /**
     * Genera un token de autenticación de sesión seguro y aleatorio.
     */
    public String generateAuthToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return "tp_" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
