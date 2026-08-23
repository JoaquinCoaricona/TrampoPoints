package com.trampopoints.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @Column(name = "trip_id", nullable = false)
    private String tripId;

    @Column(name = "status")
    private String status; // "CONFIRMED", "SEARCHING", etc.

    @Column(name = "passenger_count")
    private Integer passengerCount;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "estimated_price_per_passenger")
    private Integer estimatedPricePerPassenger;

    @Column(name = "estimated_savings_percent")
    private Integer estimatedSavingsPercent;

    @Column(name = "departure_time")
    private String departureTime;

    // Origen plano
    @Column(name = "origin_address")
    private String originAddress;
    @Column(name = "origin_latitude")
    private Double originLatitude;
    @Column(name = "origin_longitude")
    private Double originLongitude;

    // Destino plano
    @Column(name = "destination_address")
    private String destinationAddress;
    @Column(name = "destination_latitude")
    private Double destinationLatitude;
    @Column(name = "destination_longitude")
    private Double destinationLongitude;

    @Column(name = "distance_meters")
    private Integer distanceMeters;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "polyline", length = 2048)
    private String polyline;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "trip_stops", joinColumns = @JoinColumn(name = "trip_id"))
    private List<Stop> stops = new ArrayList<>();

    @Column(name = "driver_id")
    private String driverId;

    public Trip() {}

    public Trip(String tripId, String status, Integer passengerCount, Integer capacity,
                Integer estimatedPricePerPassenger, Integer estimatedSavingsPercent, String departureTime,
                Location origin, Location destination, Integer distanceMeters, Integer durationSeconds,
                String polyline, List<Stop> stops) {
        this.tripId = tripId;
        this.status = status;
        this.passengerCount = passengerCount;
        this.capacity = capacity;
        this.estimatedPricePerPassenger = estimatedPricePerPassenger;
        this.estimatedSavingsPercent = estimatedSavingsPercent;
        this.departureTime = departureTime;
        if (origin != null) {
            this.originAddress = origin.getAddress();
            this.originLatitude = origin.getLatitude();
            this.originLongitude = origin.getLongitude();
        }
        if (destination != null) {
            this.destinationAddress = destination.getAddress();
            this.destinationLatitude = destination.getLatitude();
            this.destinationLongitude = destination.getLongitude();
        }
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.polyline = polyline;
        this.stops = stops != null ? stops : new ArrayList<>();
    }

    public Location getOrigin() {
        return new Location(originLatitude, originLongitude, originAddress);
    }

    public void setOrigin(Location origin) {
        if (origin != null) {
            this.originAddress = origin.getAddress();
            this.originLatitude = origin.getLatitude();
            this.originLongitude = origin.getLongitude();
        }
    }

    public Location getDestination() {
        return new Location(destinationLatitude, destinationLongitude, destinationAddress);
    }

    public void setDestination(Location destination) {
        if (destination != null) {
            this.destinationAddress = destination.getAddress();
            this.destinationLatitude = destination.getLatitude();
            this.destinationLongitude = destination.getLongitude();
        }
    }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer passengerCount) { this.passengerCount = passengerCount; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getEstimatedPricePerPassenger() { return estimatedPricePerPassenger; }
    public void setEstimatedPricePerPassenger(Integer estimatedPricePerPassenger) { this.estimatedPricePerPassenger = estimatedPricePerPassenger; }
    public Integer getEstimatedSavingsPercent() { return estimatedSavingsPercent; }
    public void setEstimatedSavingsPercent(Integer estimatedSavingsPercent) { this.estimatedSavingsPercent = estimatedSavingsPercent; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public Integer getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Integer distanceMeters) { this.distanceMeters = distanceMeters; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getPolyline() { return polyline; }
    public void setPolyline(String polyline) { this.polyline = polyline; }
    public List<Stop> getStops() { return stops; }
    public void setStops(List<Stop> stops) { this.stops = stops; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
}
