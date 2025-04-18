
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.InstallationUpdate;
import com.communitysolar.model.Installation;

import java.util.List;

@Repository
public interface InstallationUpdateRepository extends JpaRepository<InstallationUpdate, Long> {
    List<InstallationUpdate> findByInstallationOrderByUpdateTimeDesc(Installation installation);
    InstallationUpdate findTopByInstallationOrderByUpdateTimeDesc(Installation installation);
}
