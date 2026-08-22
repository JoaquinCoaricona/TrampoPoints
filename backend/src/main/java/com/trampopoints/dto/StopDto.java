package com.trampopoints.dto;

public class StopDto {
    private String stopId;
    private String type; // "PICKUP" or "DROPOFF"
    private Integer order;
    private Double latitude;
    private Double longitude;
    private String address;

    public StopDto() {}

    public StopDto(String stopId, String type, Integer order, Double latitude, Double longitude, String address) {
        this.stopId = stopId;
        this.type = type;
        this.order = order;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    public String getStopId() {
        return stopId;
    }

    public void setStopId(String stopId) {
        this.stopId = stopId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
