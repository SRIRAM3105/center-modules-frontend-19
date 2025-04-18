
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solar_usage")
@Data
@NoArgsConstructor
public class SolarUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "installation_id")
    private Installation installation;

    @Column(name = "solar_energy_used")
    private Double solarEnergyUsed; // in kWh

    @Column(name = "grid_energy_used")
    private Double gridEnergyUsed; // in kWh

    @Column(name = "reading_timestamp")
    private LocalDateTime readingTimestamp;

    @Column(name = "bill_amount")
    private Double billAmount;
}
