
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Address;
import com.communitysolar.model.SolarPlan;
import com.communitysolar.model.User;
import com.communitysolar.repository.AddressRepository;
import com.communitysolar.repository.SolarPlanRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/data")
public class DataCollectionController {

    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private SolarPlanRepository solarPlanRepository;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addresses")
    public ResponseEntity<?> submitAddress(@Valid @RequestBody Address addressRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        Address address = new Address();
        address.setUser(user);
        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setZipCode(addressRequest.getZipCode());
        address.setMonthlyUsage(addressRequest.getMonthlyUsage());
        address.setMonthlyBill(addressRequest.getMonthlyBill());
        address.setHomeSize(addressRequest.getHomeSize());
        address.setRoofType(addressRequest.getRoofType());
        
        // Simulate calculating solar potential
        double solarPotential = calculateSolarPotential(
                addressRequest.getMonthlyUsage(),
                addressRequest.getRoofType(),
                addressRequest.getHomeSize());
        
        address.setSolarPotential(solarPotential);
        
        Address savedAddress = addressRepository.save(address);
        
        return ResponseEntity.ok(savedAddress);
    }

    @GetMapping("/addresses/{addressId}/solar-potential")
    public ResponseEntity<?> getSolarPotential(@PathVariable Long addressId) {
        return addressRepository.findById(addressId)
                .map(address -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("address", address);
                    response.put("solarPotential", address.getSolarPotential());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/addresses/{addressId}/solar-plan")
    public ResponseEntity<?> calculateSolarPlan(@PathVariable Long addressId, @RequestBody Map<String, Object> energyData) {
        return addressRepository.findById(addressId)
                .map(address -> {
                    // Simulate calculating a solar plan based on address and energy data
                    SolarPlan solarPlan = generateSolarPlan(address, energyData);
                    SolarPlan savedPlan = solarPlanRepository.save(solarPlan);
                    
                    return ResponseEntity.ok(savedPlan);
                })
                .orElseGet(() -> {
                    // If addressId doesn't exist, create a temp solar plan for demo purposes
                    SolarPlan tempPlan = new SolarPlan();
                    tempPlan.setSystemSizeKw(5.0);
                    tempPlan.setEstimatedProductionKwh(7500.0);
                    tempPlan.setPanelCount(15);
                    tempPlan.setEstimatedCost(600000.0); // ₹6,00,000
                    tempPlan.setRoiYears(5.5);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("solarPlan", tempPlan);
                    response.put("message", "Temporary plan generated. Address ID not found.");
                    
                    return ResponseEntity.ok(response);
                });
    }
    
    // Utility methods for solar calculations
    
    private double calculateSolarPotential(Double monthlyUsage, String roofType, Integer homeSize) {
        // Simplified algorithm for demo purposes
        double basePotential = monthlyUsage * 0.8; // 80% of current usage
        
        // Adjust based on roof type
        double roofFactor = 1.0;
        if (roofType != null) {
            switch (roofType) {
                case "flat":
                    roofFactor = 0.9;
                    break;
                case "sloped":
                    roofFactor = 1.1;
                    break;
                case "metal":
                    roofFactor = 1.05;
                    break;
                case "tile":
                    roofFactor = 0.95;
                    break;
                default:
                    roofFactor = 1.0;
            }
        }
        
        // Adjust based on home size
        double sizeFactor = homeSize != null ? Math.min(1.5, homeSize / 1000.0) : 1.0;
        
        return basePotential * roofFactor * sizeFactor;
    }
    
    private SolarPlan generateSolarPlan(Address address, Map<String, Object> energyData) {
        SolarPlan plan = new SolarPlan();
        plan.setAddress(address);
        
        // Extract data from the energy data
        Double monthlyUsage = null;
        if (energyData.containsKey("monthlyUsage")) {
            if (energyData.get("monthlyUsage") instanceof Integer) {
                monthlyUsage = ((Integer) energyData.get("monthlyUsage")).doubleValue();
            } else if (energyData.get("monthlyUsage") instanceof Double) {
                monthlyUsage = (Double) energyData.get("monthlyUsage");
            }
        }
        
        Double monthlyBill = null;
        if (energyData.containsKey("monthlyBill")) {
            if (energyData.get("monthlyBill") instanceof Integer) {
                monthlyBill = ((Integer) energyData.get("monthlyBill")).doubleValue();
            } else if (energyData.get("monthlyBill") instanceof Double) {
                monthlyBill = (Double) energyData.get("monthlyBill");
            }
        }
        
        // Use address energy data if not provided in the request
        if (monthlyUsage == null) {
            monthlyUsage = address.getMonthlyUsage();
        }
        if (monthlyBill == null) {
            monthlyBill = address.getMonthlyBill();
        }
        
        // Calculate system size (kW)
        // Assuming 100 kWh per month per kW of solar capacity in India
        double systemSizeKw = monthlyUsage / 100.0;
        plan.setSystemSizeKw(systemSizeKw);
        
        // Calculate annual production
        // 1500 kWh per kW per year is typical in many parts of India
        double annualProduction = systemSizeKw * 1500.0;
        plan.setEstimatedProductionKwh(annualProduction);
        
        // Calculate panel count (assuming 350W panels)
        int panelCount = (int) Math.ceil((systemSizeKw * 1000) / 350.0);
        plan.setPanelCount(panelCount);
        
        // Calculate estimated cost
        // Approx. ₹60,000 per kW installed for good quality system in India
        double estimatedCost = systemSizeKw * 60000.0;
        plan.setEstimatedCost(estimatedCost);
        
        // Calculate ROI in years
        double annualSavings = monthlyBill * 12.0 * 0.9; // Assuming 90% bill savings
        double roiYears = estimatedCost / annualSavings;
        plan.setRoiYears(roiYears);
        
        return plan;
    }
}
