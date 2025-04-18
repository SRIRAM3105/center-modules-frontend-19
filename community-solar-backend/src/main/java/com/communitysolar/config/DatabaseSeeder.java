
package com.communitysolar.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.communitysolar.model.ERole;
import com.communitysolar.model.Role;
import com.communitysolar.repository.RoleRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.repository.ProviderRepository;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        providerRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        
        System.out.println("Cleared existing data");
        
        // Initialize roles
        Role userRole = new Role(ERole.ROLE_USER);
        Role providerRole = new Role(ERole.ROLE_PROVIDER);
        Role adminRole = new Role(ERole.ROLE_ADMIN);
        
        roleRepository.saveAll(Arrays.asList(userRole, providerRole, adminRole));
        
        System.out.println("Roles initialized successfully");
    }
}
