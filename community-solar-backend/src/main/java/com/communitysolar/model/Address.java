
package com.communitysolar.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String street;
    private String city;
    private String state;
    private String zipCode;
    
    @Column(name = "monthly_usage")
    private Double monthlyUsage;
    
    @Column(name = "monthly_bill")
    private Double monthlyBill;
    
    @Column(name = "home_size")
    private Integer homeSize;
    
    @Column(name = "roof_type")
    private String roofType;

    @Column(name = "solar_potential")
    private Double solarPotential;
}
