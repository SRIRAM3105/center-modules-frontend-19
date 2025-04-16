
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Community;
import com.communitysolar.model.CommunityMember;
import com.communitysolar.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
    List<CommunityMember> findByCommunity(Community community);
    
    List<CommunityMember> findByUser(User user);
    
    Optional<CommunityMember> findByCommunityAndUser(Community community, User user);
    
    boolean existsByCommunityAndUser(Community community, User user);
}
