package com.trampopoints.repository;

import com.trampopoints.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByDriverId(String driverId);
    boolean existsByDriverIdAndStatus(String driverId, String status);
}
