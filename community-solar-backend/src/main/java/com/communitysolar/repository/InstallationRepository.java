
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Installation;
import com.communitysolar.model.Provider;
import com.communitysolar.model.User;

import java.util.List;

@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {
    List<Installation> findByUser(User user);
    
    List<Installation> findByProvider(Provider provider);
}
