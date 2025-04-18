
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.SolarUsage;
import com.communitysolar.model.User;
import com.communitysolar.model.Installation;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolarUsageRepository extends JpaRepository<SolarUsage, Long> {
    List<SolarUsage> findByUserAndReadingTimestampBetween(User user, LocalDateTime start, LocalDateTime end);
    List<SolarUsage> findByInstallationAndReadingTimestampBetween(Installation installation, LocalDateTime start, LocalDateTime end);
}
