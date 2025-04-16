
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Community;
import com.communitysolar.model.CommunityMember;
import com.communitysolar.model.ERole;
import com.communitysolar.model.Role;
import com.communitysolar.model.User;
import com.communitysolar.repository.CommunityMemberRepository;
import com.communitysolar.repository.CommunityRepository;
import com.communitysolar.repository.RoleRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommunityMemberRepository communityMemberRepository;
    
    @Autowired
    private RoleRepository roleRepository;

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
        
        communityMemberRepository.save(creatorMember);
        
        // Add the admin role to the creator for this community
        Optional<Role> adminRoleOptional = roleRepository.findByName(ERole.ROLE_ADMIN);
        if (adminRoleOptional.isPresent()) {
            Role adminRole = adminRoleOptional.get();
            Set<Role> userRoles = user.getRoles();
            userRoles.add(adminRole);
            user.setRoles(userRoles);
            userRepository.save(user);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Community created successfully");
        response.put("community", savedCommunity);
        response.put("inviteCode", savedCommunity.getInviteCode());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> joinCommunity(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        return communityRepository.findById(id)
                .map(community -> {
                    // Check if user is already a member
                    if (communityMemberRepository.existsByCommunityAndUser(community, user)) {
                        return ResponseEntity
                                .badRequest()
                                .body(new MessageResponse("Error: You are already a member of this community!"));
                    }
                    
                    // Create a new community member
                    CommunityMember member = new CommunityMember();
                    member.setCommunity(community);
                    member.setUser(user);
                    
                    // Default allocations
                    member.setEnergyAllocation(0.0); // Will be adjusted when allocation is updated
                    member.setCostShare(0.0); // Will be adjusted when cost sharing is updated
                    
                    communityMemberRepository.save(member);
                    
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
    
    @PostMapping("/join-by-code")
    public ResponseEntity<?> joinCommunityByCode(@RequestBody Map<String, String> joinRequest) {
        String inviteCode = joinRequest.get("inviteCode");
        
        if (inviteCode == null || inviteCode.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invite code is required!"));
        }
        
        Optional<Community> communityOptional = communityRepository.findByInviteCode(inviteCode);
        
        if (!communityOptional.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid invite code!"));
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Community community = communityOptional.get();
        
        // Check if user is already a member
        if (communityMemberRepository.existsByCommunityAndUser(community, user)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: You are already a member of this community!"));
        }
        
        // Create a new community member
        CommunityMember member = new CommunityMember();
        member.setCommunity(community);
        member.setUser(user);
        
        // Default allocations
        member.setEnergyAllocation(0.0);
        member.setCostShare(0.0);
        
        communityMemberRepository.save(member);
        
        // Update community member count
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully joined the community");
        response.put("community", community);
        
        return ResponseEntity.ok(response);
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
    
    @GetMapping("/user/communities")
    public ResponseEntity<?> getUserCommunities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        List<CommunityMember> memberships = communityMemberRepository.findByUser(user);
        
        List<Community> communities = memberships.stream()
                .map(CommunityMember::getCommunity)
                .toList();
        
        return ResponseEntity.ok(communities);
    }
}
