
package com.communitysolar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.security.UserDetailsImpl;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    @GetMapping("/energy-data/{installationId}")
    public ResponseEntity<?> getEnergyData(@PathVariable Long installationId,
                                           @RequestParam(required = false) String period) {
        
        // In a real application, you would fetch actual energy data from the database
        // Here, we generate mock data for demonstration
        
        List<Map<String, Object>> energyData = generateMockEnergyData(period);
        
        Map<String, Object> response = new HashMap<>();
        response.put("installationId", installationId);
        response.put("energyData", energyData);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/alerts/user/{userId}")
    public ResponseEntity<?> getAlerts(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if the requesting user is accessing their own data or is an admin
        if (!userDetails.getId().equals(userId) && 
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                put("message", "You are not authorized to access this resource");
            }});
        }
        
        // In a real application, you would fetch actual alerts from the database
        // Here, we generate mock alerts for demonstration
        
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        Map<String, Object> alert1 = new HashMap<>();
        alert1.put("id", 1);
        alert1.put("type", "performance");
        alert1.put("message", "Your system is producing 15% less than expected today");
        alert1.put("severity", "warning");
        alert1.put("timestamp", LocalDate.now().minusDays(1).toString());
        alert1.put("isRead", false);
        
        Map<String, Object> alert2 = new HashMap<>();
        alert2.put("id", 2);
        alert2.put("type", "maintenance");
        alert2.put("message", "Scheduled maintenance check due in 5 days");
        alert2.put("severity", "info");
        alert2.put("timestamp", LocalDate.now().minusDays(3).toString());
        alert2.put("isRead", true);
        
        alerts.add(alert1);
        alerts.add(alert2);
        
        return ResponseEntity.ok(alerts);
    }

    // Helper method to generate mock energy data
    private List<Map<String, Object>> generateMockEnergyData(String period) {
        List<Map<String, Object>> data = new ArrayList<>();
        Random random = new Random();
        
        // Default to monthly if not specified
        if (period == null || period.isEmpty()) {
            period = "monthly";
        }
        
        switch (period.toLowerCase()) {
            case "daily":
                // 24 hours of the current day
                for (int hour = 0; hour < 24; hour++) {
                    Map<String, Object> hourData = new HashMap<>();
                    hourData.put("time", String.format("%02d:00", hour));
                    
                    // Solar production peaks during midday
                    double production = 0;
                    if (hour >= 6 && hour <= 18) {
                        // Bell curve-ish pattern for solar production
                        production = 2.0 * Math.exp(-Math.pow(hour - 12, 2) / 20.0);
                        // Add some randomness
                        production *= (0.9 + 0.2 * random.nextDouble());
                    }
                    
                    // Consumption varies throughout the day with peaks in morning and evening
                    double consumption = 0.5;
                    if (hour >= 6 && hour <= 9) {
                        consumption = 1.2; // Morning peak
                    } else if (hour >= 17 && hour <= 22) {
                        consumption = 1.5; // Evening peak
                    }
                    // Add some randomness
                    consumption *= (0.8 + 0.4 * random.nextDouble());
                    
                    hourData.put("production", Math.round(production * 100.0) / 100.0);
                    hourData.put("consumption", Math.round(consumption * 100.0) / 100.0);
                    hourData.put("gridImported", Math.max(0, Math.round((consumption - production) * 100.0) / 100.0));
                    hourData.put("gridExported", Math.max(0, Math.round((production - consumption) * 100.0) / 100.0));
                    
                    data.add(hourData);
                }
                break;
                
            case "monthly":
            default:
                // Data for each day of the current month
                YearMonth yearMonth = YearMonth.now();
                int daysInMonth = yearMonth.lengthOfMonth();
                
                for (int day = 1; day <= daysInMonth; day++) {
                    Map<String, Object> dayData = new HashMap<>();
                    dayData.put("date", LocalDate.of(yearMonth.getYear(), yearMonth.getMonthValue(), day).toString());
                    
                    // Base production with some randomness and seasonal variation
                    double seasonalFactor = 1.0;
                    int month = yearMonth.getMonthValue();
                    if (month >= 11 || month <= 2) {
                        seasonalFactor = 0.7; // Winter
                    } else if (month >= 6 && month <= 8) {
                        seasonalFactor = 1.3; // Summer
                    }
                    
                    double production = 15.0 * seasonalFactor * (0.8 + 0.4 * random.nextDouble());
                    double consumption = 12.0 * (0.8 + 0.4 * random.nextDouble());
                    
                    dayData.put("production", Math.round(production * 10.0) / 10.0);
                    dayData.put("consumption", Math.round(consumption * 10.0) / 10.0);
                    dayData.put("gridImported", Math.max(0, Math.round((consumption - production) * 10.0) / 10.0));
                    dayData.put("gridExported", Math.max(0, Math.round((production - consumption) * 10.0) / 10.0));
                    
                    data.add(dayData);
                }
                break;
        }
        
        return data;
    }
}
