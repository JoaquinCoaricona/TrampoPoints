package com.trampopoints.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Stop {
    private String stopId;
    private String type; // "PICKUP" or "DROPOFF"
    private Integer orderIndex; // Cambiado a orderIndex para evitar palabras reservadas como "ORDER" en SQL
    private Double latitude;
    private Double longitude;
    private String address;

    public Stop() {}

    public Stop(String stopId, String type, Integer orderIndex, Double latitude, Double longitude, String address) {
        this.stopId = stopId;
        this.type = type;
        this.orderIndex = orderIndex;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    public String getStopId() { return stopId; }
    public void setStopId(String stopId) { this.stopId = stopId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getOrder() { return orderIndex; }
    public void setOrder(Integer orderIndex) { this.orderIndex = orderIndex; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
