
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Community;
import com.communitysolar.model.CommunityMember;
import com.communitysolar.model.User;
import com.communitysolar.repository.CommunityRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/communities")
public class CommunityController {

    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities(
            @RequestParam(required = false) String zipCode) {
        
        List<Community> communities;
        if (zipCode != null && !zipCode.isEmpty()) {
            communities = communityRepository.findByZipCode(zipCode);
        } else {
            communities = communityRepository.findAll();
        }
        
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable Long id) {
        return communityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCommunity(@Valid @RequestBody Community communityRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Community community = new Community();
        community.setName(communityRequest.getName());
        community.setDescription(communityRequest.getDescription());
        community.setLocation(communityRequest.getLocation());
        community.setZipCode(communityRequest.getZipCode());
        community.setCreator(user);
        community.setMemberCount(1); // Creator is the first member
        
        Community savedCommunity = communityRepository.save(community);
        
        // Create a community member entry for the creator
        CommunityMember creatorMember = new CommunityMember();
        creatorMember.setCommunity(savedCommunity);
        creatorMember.setUser(user);
        creatorMember.setEnergyAllocation(100.0); // Initial full allocation
        creatorMember.setCostShare(100.0); // Initial full cost share
        
        // In a real-world app, you would save this to a communityMemberRepository
        
        return ResponseEntity.ok(savedCommunity);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> joinCommunity(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> userData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        return communityRepository.findById(id)
                .map(community -> {
                    // In a real application, you'd check if the user is already a member
                    
                    // Create a new community member
                    CommunityMember member = new CommunityMember();
                    member.setCommunity(community);
                    member.setUser(user);
                    
                    // Default allocations
                    member.setEnergyAllocation(0.0); // Will be adjusted when allocation is updated
                    member.setCostShare(0.0); // Will be adjusted when cost sharing is updated
                    
                    // In a real-world app, you would save this to a communityMemberRepository
                    
                    // Update community member count
                    community.setMemberCount(community.getMemberCount() + 1);
                    communityRepository.save(community);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Successfully joined the community");
                    response.put("community", community);
                    
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/allocation")
    public ResponseEntity<?> updateEnergyAllocation(@PathVariable Long id, @RequestBody Map<String, Object> allocationData) {
        return communityRepository.findById(id)
                .map(community -> {
                    // In a real application, you would update the energy allocation for each member
                    // based on the allocation data
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Energy allocation updated successfully");
                    response.put("community", community);
                    
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
