
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Community;
import com.communitysolar.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByCreator(User creator);
    
    List<Community> findByZipCode(String zipCode);
    
    Optional<Community> findByInviteCode(String inviteCode);
}
