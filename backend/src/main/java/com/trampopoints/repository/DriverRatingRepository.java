package com.trampopoints.repository;

import com.trampopoints.model.DriverRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRatingRepository extends JpaRepository<DriverRating, String> {
    List<DriverRating> findByDriverId(String driverId);
}
