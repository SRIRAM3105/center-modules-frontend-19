
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Provider;
import com.communitysolar.model.User;
import com.communitysolar.repository.ProviderRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/providers")
public class ProviderController {

    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private UserRepository userRepository;

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
}
