package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Community;
import com.communitysolar.model.Provider;
import com.communitysolar.model.User;
import com.communitysolar.repository.CommunityRepository;
import com.communitysolar.repository.ProviderRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommunityRepository communityRepository;

    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        List<Provider> providers = providerRepository.findAll();
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable Long id) {
        return providerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProvider(@Valid @RequestBody Provider providerRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        // Check if the user already has a provider profile
        if (providerRepository.findByUser(user).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Provider profile already exists for this user!"));
        }
        
        // Validate provider data
        if (providerRequest.getName() == null || providerRequest.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Provider name is required."));
        }
        
        Provider provider = new Provider();
        provider.setName(providerRequest.getName());
        provider.setDescription(providerRequest.getDescription());
        provider.setAddress(providerRequest.getAddress());
        provider.setWebsite(providerRequest.getWebsite());
        provider.setPhone(providerRequest.getPhone());
        provider.setEmail(providerRequest.getEmail());
        provider.setYearsExperience(providerRequest.getYearsExperience());
        provider.setUser(user);
        
        Provider savedProvider = providerRepository.save(provider);
        
        return ResponseEntity.ok(savedProvider);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProvider(@PathVariable Long id, @Valid @RequestBody Provider providerRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return providerRepository.findById(id)
                .map(provider -> {
                    // Check if the user is the owner of the provider profile or an admin
                    if (provider.getUser().getId().equals(userDetails.getId()) || 
                            authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        
                        provider.setName(providerRequest.getName());
                        provider.setDescription(providerRequest.getDescription());
                        provider.setAddress(providerRequest.getAddress());
                        provider.setWebsite(providerRequest.getWebsite());
                        provider.setPhone(providerRequest.getPhone());
                        provider.setEmail(providerRequest.getEmail());
                        provider.setYearsExperience(providerRequest.getYearsExperience());
                        
                        Provider updatedProvider = providerRepository.save(provider);
                        return ResponseEntity.ok(updatedProvider);
                    } else {
                        return ResponseEntity.status(403).body(new MessageResponse("Error: You are not authorized to update this provider profile!"));
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/certification")
    public ResponseEntity<?> getProviderCertification(@PathVariable Long id) {
        return providerRepository.findById(id)
                .map(provider -> {
                    return ResponseEntity.ok(new MessageResponse(
                            provider.isCertified() ? "Provider is certified" : "Provider is not certified"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{providerId}/quotes")
    public ResponseEntity<?> requestQuote(
            @PathVariable Long providerId, 
            @RequestBody Map<String, Object> quoteRequest) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        return providerRepository.findById(providerId)
                .map(provider -> {
                    // In a real implementation, save the quote request to a database
                    // For now, just return a success message
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Quote request sent successfully");
                    response.put("providerId", providerId);
                    response.put("requestId", System.currentTimeMillis()); // Use timestamp as requestId for demo
                    response.put("status", "pending");
                    
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Provider not found!"));
                });
    }
    
    @GetMapping("/quotes/requests")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getQuoteRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Optional<Provider> providerOpt = providerRepository.findByUser(user);
        if (!providerOpt.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: No provider profile found for this user!"));
        }
        
        // In a real implementation, retrieve actual quote requests from a database
        // For demo purposes, return sample quote requests
        List<Map<String, Object>> quoteRequests = new ArrayList<>();
        
        Map<String, Object> request1 = new HashMap<>();
        request1.put("requestId", 12345L);
        request1.put("communityId", 1L);
        request1.put("communityName", "Green Valley Solar Community");
        request1.put("requestDate", "2023-05-15");
        request1.put("systemSizeKw", 25.5);
        request1.put("status", "pending");
        
        Map<String, Object> request2 = new HashMap<>();
        request2.put("requestId", 12346L);
        request2.put("communityId", 2L);
        request2.put("communityName", "Sunset Hills Community");
        request2.put("requestDate", "2023-05-16");
        request2.put("systemSizeKw", 30.2);
        request2.put("status", "pending");
        
        quoteRequests.add(request1);
        quoteRequests.add(request2);
        
        return ResponseEntity.ok(quoteRequests);
    }
    
    @PostMapping("/quotes/{requestId}/submit")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> submitQuote(
            @PathVariable Long requestId, 
            @RequestBody Map<String, Object> quoteData) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Optional<Provider> providerOpt = providerRepository.findByUser(user);
        if (!providerOpt.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: No provider profile found for this user!"));
        }
        
        // Validate quote data
        if (!quoteData.containsKey("price") || !(quoteData.get("price") instanceof Number)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Quote price is required and must be a number!"));
        }
        
        // In a real implementation, save the submitted quote to a database
        // For now, just return a success message
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quote submitted successfully");
        response.put("requestId", requestId);
        response.put("providerId", providerOpt.get().getId());
        response.put("price", quoteData.get("price"));
        response.put("status", "submitted");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{providerId}/select-winner")
    public ResponseEntity<?> selectWinningProvider(@PathVariable Long providerId) {
        // In a real implementation, this would update a project record to mark this provider as selected
        
        return providerRepository.findById(providerId)
                .map(provider -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Provider selected as winner");
                    response.put("providerId", providerId);
                    response.put("providerName", provider.getName());
                    response.put("status", "selected");
                    
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Provider not found!")));
    }
    
    @GetMapping("/projects/active")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getActiveProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Optional<Provider> providerOpt = providerRepository.findByUser(user);
        if (!providerOpt.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: No provider profile found for this user!"));
        }
        
        // In a real implementation, retrieve actual active projects from a database
        // For demo purposes, return sample active projects
        List<Map<String, Object>> activeProjects = new ArrayList<>();
        
        Map<String, Object> project1 = new HashMap<>();
        project1.put("projectId", 101L);
        project1.put("communityId", 1L);
        project1.put("communityName", "Green Valley Solar Community");
        project1.put("location", "Bangalore, Karnataka");
        project1.put("systemSizeKw", 25.5);
        project1.put("startDate", "2023-06-01");
        project1.put("status", "in-progress");
        project1.put("progress", 65);
        
        Map<String, Object> project2 = new HashMap<>();
        project2.put("projectId", 102L);
        project2.put("communityId", 3L);
        project2.put("communityName", "Eco Friendly Community");
        project2.put("location", "Mumbai, Maharashtra");
        project2.put("systemSizeKw", 18.2);
        project2.put("startDate", "2023-06-15");
        project2.put("status", "planning");
        project2.put("progress", 15);
        
        activeProjects.add(project1);
        activeProjects.add(project2);
        
        return ResponseEntity.ok(activeProjects);
    }
    
    @PutMapping("/projects/{projectId}/progress")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateInstallationProgress(
            @PathVariable Long projectId, 
            @RequestBody Map<String, Object> progressData) {
        
        // Validate progress data
        if (!progressData.containsKey("progress") || !(progressData.get("progress") instanceof Number)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Progress percentage is required and must be a number!"));
        }
        
        int progress = ((Number) progressData.get("progress")).intValue();
        if (progress < 0 || progress > 100) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Progress percentage must be between 0 and 100!"));
        }
        
        // In a real implementation, update the project record in the database
        // For now, just return a success message
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Installation progress updated successfully");
        response.put("projectId", projectId);
        response.put("progress", progress);
        
        return ResponseEntity.ok(response);
    }
}
