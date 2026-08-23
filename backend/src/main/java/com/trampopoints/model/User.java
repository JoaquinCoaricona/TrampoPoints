package com.trampopoints.model;

import java.time.LocalDateTime;

public class User {
    private String id;
    private String name;
    private String email;
    private String passwordHash;
    private String salt;
    private UserRole role; // USER, ADMIN, DRIVER
    private LocalDateTime createdAt;

    public User() {
        this.role = UserRole.USER;
        this.createdAt = LocalDateTime.now();
    }

    public User(String id, String name, String email, String passwordHash, String salt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
        this.role = UserRole.USER;
        this.createdAt = LocalDateTime.now();
    }

    public User(String id, String name, String email, String passwordHash, String salt, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
        this.role = role != null ? role : UserRole.USER;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
