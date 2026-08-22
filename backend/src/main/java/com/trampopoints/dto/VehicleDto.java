package com.trampopoints.dto;

import java.util.ArrayList;
import java.util.List;

public class VehicleDto {
    private String id;
    private String driverId;
    private String brand;
    private String model;
    private Integer year;
    private String color;
    private String licensePlate;
    private String imageUrl;
    private String vehicleType;
    private Integer passengerCapacity;
    private Integer seatCount;
    private String luggageCapacity;
    private Integer approxCargoKg;
    private Boolean allowsBulkyObjects;
    private List<String> features = new ArrayList<>();
    private String status;

    public VehicleDto() {}

    public VehicleDto(String id, String driverId, String brand, String model, Integer year, String color, String licensePlate, String imageUrl, String vehicleType, Integer passengerCapacity, Integer seatCount, String luggageCapacity, Integer approxCargoKg, Boolean allowsBulkyObjects, List<String> features, String status) {
        this.id = id;
        this.driverId = driverId;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.color = color;
        this.licensePlate = licensePlate;
        this.imageUrl = imageUrl;
        this.vehicleType = vehicleType;
        this.passengerCapacity = passengerCapacity;
        this.seatCount = seatCount;
        this.luggageCapacity = luggageCapacity;
        this.approxCargoKg = approxCargoKg;
        this.allowsBulkyObjects = allowsBulkyObjects;
        this.features = features != null ? features : new ArrayList<>();
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Integer getPassengerCapacity() {
        return passengerCapacity;
    }

    public void setPassengerCapacity(Integer passengerCapacity) {
        this.passengerCapacity = passengerCapacity;
    }

    public Integer getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(Integer seatCount) {
        this.seatCount = seatCount;
    }

    public String getLuggageCapacity() {
        return luggageCapacity;
    }

    public void setLuggageCapacity(String luggageCapacity) {
        this.luggageCapacity = luggageCapacity;
    }

    public Integer getApproxCargoKg() {
        return approxCargoKg;
    }

    public void setApproxCargoKg(Integer approxCargoKg) {
        this.approxCargoKg = approxCargoKg;
    }

    public Boolean getAllowsBulkyObjects() {
        return allowsBulkyObjects;
    }

    public void setAllowsBulkyObjects(Boolean allowsBulkyObjects) {
        this.allowsBulkyObjects = allowsBulkyObjects;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
