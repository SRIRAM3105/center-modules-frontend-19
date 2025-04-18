package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "installations")
@Data
@NoArgsConstructor
public class Installation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solar_plan_id")
    private SolarPlan solarPlan;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private InstallationStatus status;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "current_progress")
    private Integer currentProgress = 0;

    @Column(name = "is_generating")
    private boolean isGenerating = false;

    @Column(name = "total_capacity_kw")
    private Double totalCapacityKw;

    @Column(name = "generation_start_date")
    private LocalDateTime generationStartDate;

    @OneToMany(mappedBy = "installation", cascade = CascadeType.ALL)
    private Set<InstallationMilestone> milestones = new HashSet<>();

    @OneToMany(mappedBy = "installation", cascade = CascadeType.ALL)
    private Set<InstallationUpdate> updates = new HashSet<>();

    @OneToMany(mappedBy = "installation", cascade = CascadeType.ALL)
    private Set<SolarUsage> usageData = new HashSet<>();

    public enum InstallationStatus {
        PENDING, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
