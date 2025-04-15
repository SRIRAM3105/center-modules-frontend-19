
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "energy_data")
@Data
@NoArgsConstructor
public class EnergyData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "installation_id")
    private Installation installation;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "energy_produced")
    private Double energyProduced;

    @Column(name = "energy_consumed")
    private Double energyConsumed;

    @Column(name = "grid_imported")
    private Double gridImported;

    @Column(name = "grid_exported")
    private Double gridExported;
}
