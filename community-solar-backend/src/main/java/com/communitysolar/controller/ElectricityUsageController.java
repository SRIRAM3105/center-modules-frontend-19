
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.ElectricityUsage;
import com.communitysolar.model.User;
import com.communitysolar.repository.ElectricityUsageRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/electricity-usage")
public class ElectricityUsageController {

    @Autowired
    private ElectricityUsageRepository electricityUsageRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserElectricityUsage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        List<ElectricityUsage> usageData = electricityUsageRepository.findByUser(user);
        
        return ResponseEntity.ok(usageData);
    }

    @PostMapping
    public ResponseEntity<?> submitElectricityUsage(@Valid @RequestBody Map<String, Object> usageRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> bills = (List<Map<String, Object>>) usageRequest.get("bills");
            
            if (bills == null || bills.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: No electricity usage data provided!"));
            }
            
            // Validate each bill entry for negative values
            for (Map<String, Object> bill : bills) {
                double units = ((Number) bill.get("units")).doubleValue();
                double amount = ((Number) bill.get("amount")).doubleValue();
                
                if (units < 0) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Energy consumption cannot be negative."));
                }
                
                if (amount < 0) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Bill amount cannot be negative."));
                }
            }
            
            // Save each bill entry as a separate ElectricityUsage record
            List<ElectricityUsage> savedData = bills.stream()
                    .map(bill -> {
                        ElectricityUsage usage = new ElectricityUsage();
                        usage.setUser(user);
                        usage.setPeriod((String) bill.get("period"));
                        usage.setUnits(((Number) bill.get("units")).doubleValue());
                        usage.setAmount(((Number) bill.get("amount")).doubleValue());
                        return electricityUsageRepository.save(usage);
                    })
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Electricity usage data submitted successfully");
            response.put("data", savedData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
