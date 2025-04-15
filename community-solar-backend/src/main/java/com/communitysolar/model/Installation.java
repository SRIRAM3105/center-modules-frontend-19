
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

    @OneToMany(mappedBy = "installation", cascade = CascadeType.ALL)
    private Set<InstallationMilestone> milestones = new HashSet<>();

    public enum InstallationStatus {
        PENDING, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
