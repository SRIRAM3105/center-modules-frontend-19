
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "installation_updates")
@Data
@NoArgsConstructor
public class InstallationUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "installation_id")
    private Installation installation;

    private Integer progressPercentage;
    
    @Column(columnDefinition = "TEXT")
    private String updateNotes;
    
    private LocalDateTime updateTime;
    
    @Column(name = "completed")
    private boolean isCompleted;
}
