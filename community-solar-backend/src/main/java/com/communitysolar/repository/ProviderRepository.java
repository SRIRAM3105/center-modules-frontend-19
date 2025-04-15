
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Provider;
import com.communitysolar.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUser(User user);
    
    List<Provider> findByIsCertified(boolean isCertified);
}
