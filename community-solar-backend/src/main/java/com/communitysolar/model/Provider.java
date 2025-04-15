
package com.communitysolar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "providers")
@Data
@NoArgsConstructor
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;
    private String website;
    private String phone;
    private String email;

    @Column(name = "is_certified")
    private boolean isCertified = false;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "avg_rating")
    private Double averageRating;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private Set<ProviderReview> reviews = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
