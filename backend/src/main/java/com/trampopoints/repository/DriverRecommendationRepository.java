package com.trampopoints.repository;

import com.trampopoints.model.DriverRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRecommendationRepository extends JpaRepository<DriverRecommendation, String> {
    List<DriverRecommendation> findByDriverId(String driverId);
}
