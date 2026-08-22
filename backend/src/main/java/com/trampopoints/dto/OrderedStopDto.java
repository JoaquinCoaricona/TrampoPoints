package com.trampopoints.dto;

public class OrderedStopDto {
    private Integer order;
    private Double latitude;
    private Double longitude;

    public OrderedStopDto() {}

    public OrderedStopDto(Integer order, Double latitude, Double longitude) {
        this.order = order;
        this.latitude = latitude;
        this.longitude = longitude;
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
}
