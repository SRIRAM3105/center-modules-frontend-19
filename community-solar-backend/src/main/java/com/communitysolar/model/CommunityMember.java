
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_members")
@Data
@NoArgsConstructor
public class CommunityMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "community_id")
    private Community community;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "join_date")
    private LocalDateTime joinDate;

    @Column(name = "energy_allocation")
    private Double energyAllocation;

    @Column(name = "cost_share")
    private Double costShare;

    @PrePersist
    protected void onCreate() {
        joinDate = LocalDateTime.now();
    }
}
