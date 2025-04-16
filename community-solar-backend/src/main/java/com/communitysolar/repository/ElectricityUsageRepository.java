
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.ElectricityUsage;
import com.communitysolar.model.User;

import java.util.List;

@Repository
public interface ElectricityUsageRepository extends JpaRepository<ElectricityUsage, Long> {
    List<ElectricityUsage> findByUser(User user);
    
    List<ElectricityUsage> findByUserAndPeriod(User user, String period);
}
