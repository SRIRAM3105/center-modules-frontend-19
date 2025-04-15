
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Address;
import com.communitysolar.model.SolarPlan;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolarPlanRepository extends JpaRepository<SolarPlan, Long> {
    List<SolarPlan> findByAddress(Address address);
    
    Optional<SolarPlan> findFirstByAddressOrderByCreatedAtDesc(Address address);
}
