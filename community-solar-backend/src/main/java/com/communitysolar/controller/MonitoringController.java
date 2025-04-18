
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.model.*;
import com.communitysolar.repository.*;
import com.communitysolar.security.UserDetailsImpl;
import com.communitysolar.util.TNEBTariffCalculator;

import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    @Autowired
    private InstallationRepository installationRepository;

    @Autowired
    private InstallationUpdateRepository updateRepository;

    @Autowired
    private SolarUsageRepository solarUsageRepository;

    @GetMapping("/installation/{installationId}/progress")
    public ResponseEntity<?> getInstallationProgress(@PathVariable Long installationId) {
        return installationRepository.findById(installationId)
            .map(installation -> {
                Map<String, Object> response = new HashMap<>();
                response.put("currentProgress", installation.getCurrentProgress());
                response.put("isGenerating", installation.isGenerating());
                response.put("updates", updateRepository.findByInstallationOrderByUpdateTimeDesc(installation));
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/installation/{installationId}/update")
    public ResponseEntity<?> updateInstallationProgress(
            @PathVariable Long installationId,
            @RequestBody Map<String, Object> updateData) {
        
        return installationRepository.findById(installationId)
            .map(installation -> {
                InstallationUpdate update = new InstallationUpdate();
                update.setInstallation(installation);
                update.setProgressPercentage((Integer) updateData.get("progress"));
                update.setUpdateNotes((String) updateData.get("notes"));
                update.setUpdateTime(LocalDateTime.now());
                update.setCompleted((Integer) updateData.get("progress") == 100);
                
                installation.setCurrentProgress((Integer) updateData.get("progress"));
                if ((Integer) updateData.get("progress") == 100) {
                    installation.setIsGenerating(true);
                    installation.setGenerationStartDate(LocalDateTime.now());
                }
                
                installationRepository.save(installation);
                updateRepository.save(update);
                
                return ResponseEntity.ok(Map.of(
                    "message", "Progress updated successfully",
                    "currentProgress", installation.getCurrentProgress(),
                    "isGenerating", installation.isGenerating()
                ));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usage/{userId}")
    public ResponseEntity<?> getUserSolarUsage(
            @PathVariable Long userId,
            @RequestParam(required = false) String period) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (!userDetails.getId().equals(userId) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        
        switch (period != null ? period : "monthly") {
            case "daily":
                start = end.minusDays(1);
                break;
            case "weekly":
                start = end.minusWeeks(1);
                break;
            case "yearly":
                start = end.minusYears(1);
                break;
            case "monthly":
            default:
                start = end.minusMonths(1);
        }
        
        User user = new User();
        user.setId(userId);
        
        List<SolarUsage> usageData = solarUsageRepository.findByUserAndReadingTimestampBetween(user, start, end);
        
        double totalSolarUsed = usageData.stream()
            .mapToDouble(SolarUsage::getSolarEnergyUsed)
            .sum();
            
        double totalGridUsed = usageData.stream()
            .mapToDouble(SolarUsage::getGridEnergyUsed)
            .sum();
            
        double billWithoutSolar = TNEBTariffCalculator.calculateBill(totalSolarUsed + totalGridUsed);
        double actualBill = TNEBTariffCalculator.calculateBill(totalGridUsed);
        double savings = billWithoutSolar - actualBill;
        
        Map<String, Object> response = new HashMap<>();
        response.put("period", period);
        response.put("solarUsage", totalSolarUsed);
        response.put("gridUsage", totalGridUsed);
        response.put("billWithoutSolar", billWithoutSolar);
        response.put("actualBill", actualBill);
        response.put("savings", savings);
        response.put("usageData", usageData);
        
        return ResponseEntity.ok(response);
    }
}
