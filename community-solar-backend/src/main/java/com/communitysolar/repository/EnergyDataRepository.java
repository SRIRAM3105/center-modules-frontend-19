
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.EnergyData;
import com.communitysolar.model.Installation;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnergyDataRepository extends JpaRepository<EnergyData, Long> {
    List<EnergyData> findByInstallation(Installation installation);
    
    List<EnergyData> findByInstallationAndTimestampBetween(Installation installation, LocalDateTime start, LocalDateTime end);
}
