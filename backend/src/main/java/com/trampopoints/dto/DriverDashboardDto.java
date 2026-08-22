package com.trampopoints.dto;

import java.util.ArrayList;
import java.util.List;

public class DriverDashboardDto {
    private DriverDto driver;
    private VehicleDto vehicle;
    private DriverRatingSummaryDto ratingSummary;
    private Integer validDocsCount;
    private Integer expiredDocsCount;
    private Integer totalDocsCount;
    private List<DriverRecommendationDto> topRecommendations = new ArrayList<>();

    public DriverDashboardDto() {}

    public DriverDashboardDto(DriverDto driver, VehicleDto vehicle, DriverRatingSummaryDto ratingSummary, Integer validDocsCount, Integer expiredDocsCount, Integer totalDocsCount, List<DriverRecommendationDto> topRecommendations) {
        this.driver = driver;
        this.vehicle = vehicle;
        this.ratingSummary = ratingSummary;
        this.validDocsCount = validDocsCount;
        this.expiredDocsCount = expiredDocsCount;
        this.totalDocsCount = totalDocsCount;
        this.topRecommendations = topRecommendations != null ? topRecommendations : new ArrayList<>();
    }

    public DriverDto getDriver() {
        return driver;
    }

    public void setDriver(DriverDto driver) {
        this.driver = driver;
    }

    public VehicleDto getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleDto vehicle) {
        this.vehicle = vehicle;
    }

    public DriverRatingSummaryDto getRatingSummary() {
        return ratingSummary;
    }

    public void setRatingSummary(DriverRatingSummaryDto ratingSummary) {
        this.ratingSummary = ratingSummary;
    }

    public Integer getValidDocsCount() {
        return validDocsCount;
    }

    public void setValidDocsCount(Integer validDocsCount) {
        this.validDocsCount = validDocsCount;
    }

    public Integer getExpiredDocsCount() {
        return expiredDocsCount;
    }

    public void setExpiredDocsCount(Integer expiredDocsCount) {
        this.expiredDocsCount = expiredDocsCount;
    }

    public Integer getTotalDocsCount() {
        return totalDocsCount;
    }

    public void setTotalDocsCount(Integer totalDocsCount) {
        this.totalDocsCount = totalDocsCount;
    }

    public List<DriverRecommendationDto> getTopRecommendations() {
        return topRecommendations;
    }

    public void setTopRecommendations(List<DriverRecommendationDto> topRecommendations) {
        this.topRecommendations = topRecommendations;
    }
}
