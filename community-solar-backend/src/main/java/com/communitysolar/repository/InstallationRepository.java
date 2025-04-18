package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Installation;
import com.communitysolar.model.Provider;
import com.communitysolar.model.User;
import com.communitysolar.model.Community;

import java.util.List;

@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {
    List<Installation> findByUser(User user);
    
    List<Installation> findByProvider(Provider provider);
    
    List<Installation> findByCommunity(Community community);
    List<Installation> findByCommunityAndIsGenerating(Community community, boolean isGenerating);
    List<Installation> findByUserAndIsGenerating(User user, boolean isGenerating);
}
