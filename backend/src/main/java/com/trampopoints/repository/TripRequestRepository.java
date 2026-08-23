package com.trampopoints.repository;

import com.trampopoints.model.TripRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRequestRepository extends JpaRepository<TripRequest, String> {
    List<TripRequest> findByUserEmail(String userEmail);
}
