
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "installation_milestones")
@Data
@NoArgsConstructor
public class InstallationMilestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "installation_id")
    private Installation installation;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    private boolean completed;
}
