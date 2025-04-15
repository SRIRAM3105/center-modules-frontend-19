
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solar_plans")
@Data
@NoArgsConstructor
public class SolarPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "system_size_kw")
    private Double systemSizeKw;

    @Column(name = "estimated_production_kwh")
    private Double estimatedProductionKwh;

    @Column(name = "panel_count")
    private Integer panelCount;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "roi_years")
    private Double roiYears;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
