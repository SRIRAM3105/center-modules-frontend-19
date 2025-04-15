
package com.communitysolar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.communitysolar.model.Community;
import com.communitysolar.model.Payment;
import com.communitysolar.model.User;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    
    List<Payment> findByCommunity(Community community);
}
