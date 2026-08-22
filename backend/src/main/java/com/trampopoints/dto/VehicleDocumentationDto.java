package com.trampopoints.dto;

import java.time.LocalDate;

public class VehicleDocumentationDto {
    private String id;
    private String vehicleId;
    private String documentType;
    private String title;
    private String documentNumber;
    private String issuer;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String status; // VALID, EXPIRED, PENDING_RENEWAL
    private String notes;
    private Long daysUntilExpiration;

    public VehicleDocumentationDto() {}

    public VehicleDocumentationDto(String id, String vehicleId, String documentType, String title, String documentNumber, String issuer, LocalDate issueDate, LocalDate expirationDate, String status, String notes, Long daysUntilExpiration) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.documentType = documentType;
        this.title = title;
        this.documentNumber = documentNumber;
        this.issuer = issuer;
        this.issueDate = issueDate;
        this.expirationDate = expirationDate;
        this.status = status;
        this.notes = notes;
        this.daysUntilExpiration = daysUntilExpiration;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getDaysUntilExpiration() {
        return daysUntilExpiration;
    }

    public void setDaysUntilExpiration(Long daysUntilExpiration) {
        this.daysUntilExpiration = daysUntilExpiration;
    }
}
