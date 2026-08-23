package com.trampopoints.repository;

import com.trampopoints.model.VehicleDocumentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleDocumentationRepository extends JpaRepository<VehicleDocumentation, String> {
    List<VehicleDocumentation> findByVehicleId(String vehicleId);
}
