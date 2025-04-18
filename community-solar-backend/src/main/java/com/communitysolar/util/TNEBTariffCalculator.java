
package com.communitysolar.util;

public class TNEBTariffCalculator {
    
    public static double calculateBill(double unitsConsumed) {
        // TNEB Domestic tariff slabs (2023)
        if (unitsConsumed <= 100) {
            return 0; // Free up to 100 units
        }
        
        double amount = 0;
        
        if (unitsConsumed <= 200) {
            amount = (unitsConsumed - 100) * 2.25;
        } else if (unitsConsumed <= 400) {
            amount = 100 * 2.25 + (unitsConsumed - 200) * 4.50;
        } else if (unitsConsumed <= 500) {
            amount = 100 * 2.25 + 200 * 4.50 + (unitsConsumed - 400) * 6.00;
        } else if (unitsConsumed <= 600) {
            amount = 100 * 2.25 + 200 * 4.50 + 100 * 6.00 + (unitsConsumed - 500) * 8.00;
        } else if (unitsConsumed <= 800) {
            amount = 100 * 2.25 + 200 * 4.50 + 100 * 6.00 + 100 * 8.00 + (unitsConsumed - 600) * 9.00;
        } else if (unitsConsumed <= 1000) {
            amount = 100 * 2.25 + 200 * 4.50 + 100 * 6.00 + 100 * 8.00 + 200 * 9.00 + (unitsConsumed - 800) * 10.00;
        } else {
            amount = 100 * 2.25 + 200 * 4.50 + 100 * 6.00 + 100 * 8.00 + 200 * 9.00 + 200 * 10.00 + (unitsConsumed - 1000) * 11.00;
        }
        
        // Add fixed charges based on consumption
        if (unitsConsumed <= 100) {
            amount += 0; // No fixed charges
        } else if (unitsConsumed <= 200) {
            amount += 30;
        } else if (unitsConsumed <= 500) {
            amount += 50;
        } else {
            amount += 70;
        }
        
        return amount;
    }
}
