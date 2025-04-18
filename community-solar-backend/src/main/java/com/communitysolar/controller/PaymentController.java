
package com.communitysolar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.communitysolar.dto.auth.MessageResponse;
import com.communitysolar.model.Community;
import com.communitysolar.model.CommunityMember;
import com.communitysolar.model.ElectricityUsage;
import com.communitysolar.model.Payment;
import com.communitysolar.model.User;
import com.communitysolar.repository.CommunityMemberRepository;
import com.communitysolar.repository.CommunityRepository;
import com.communitysolar.repository.ElectricityUsageRepository;
import com.communitysolar.repository.PaymentRepository;
import com.communitysolar.repository.UserRepository;
import com.communitysolar.security.UserDetailsImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private CommunityMemberRepository communityMemberRepository;
    
    @Autowired
    private ElectricityUsageRepository electricityUsageRepository;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if the authenticated user is requesting their own payments
        if (!userDetails.getId().equals(userId)) {
            return ResponseEntity.status(403).body(new MessageResponse("You are not authorized to view these payments"));
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Payment> payments = paymentRepository.findByUser(user);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/community/{communityId}")
    public ResponseEntity<?> getCommunityPayments(@PathVariable Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        
        List<Payment> payments = paymentRepository.findByCommunity(community);
        return ResponseEntity.ok(payments);
    }
    
    @PostMapping("/calculate-quote-split")
    public ResponseEntity<?> calculateQuoteSplit(@RequestBody Map<String, Object> quoteData) {
        // Extract data from request
        Long communityId = Long.parseLong(quoteData.get("communityId").toString());
        Double totalQuoteAmount = Double.parseDouble(quoteData.get("quoteAmount").toString());
        
        // Get the community
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        
        // Get all members of the community
        List<CommunityMember> members = communityMemberRepository.findByCommunity(community);
        
        if (members.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("No members found in this community"));
        }
        
        // Calculate the total electricity usage for all members
        double totalUsage = 0.0;
        Map<Long, Double> userUsage = new HashMap<>();
        
        for (CommunityMember member : members) {
            User user = member.getUser();
            List<ElectricityUsage> usageData = electricityUsageRepository.findByUser(user);
            
            // Calculate average usage for this user
            double avgUsage = 0.0;
            if (!usageData.isEmpty()) {
                double sum = usageData.stream().mapToDouble(ElectricityUsage::getUnits).sum();
                avgUsage = sum / usageData.size();
            }
            
            userUsage.put(user.getId(), avgUsage);
            totalUsage += avgUsage;
        }
        
        // Calculate payment amount for each user based on their proportion of usage
        List<Map<String, Object>> paymentBreakdown = new ArrayList<>();
        
        for (CommunityMember member : members) {
            User user = member.getUser();
            double userAvgUsage = userUsage.get(user.getId());
            
            // Skip users with no usage data
            if (userAvgUsage <= 0) {
                continue;
            }
            
            double proportion = userAvgUsage / totalUsage;
            double paymentAmount = totalQuoteAmount * proportion;
            
            Map<String, Object> userPayment = new HashMap<>();
            userPayment.put("userId", user.getId());
            userPayment.put("username", user.getUsername());
            userPayment.put("avgUsage", userAvgUsage);
            userPayment.put("proportion", proportion);
            userPayment.put("fullPaymentAmount", paymentAmount);
            userPayment.put("monthlyInstallment", paymentAmount / 12);
            
            paymentBreakdown.add(userPayment);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("communityId", communityId);
        response.put("totalQuoteAmount", totalQuoteAmount);
        response.put("totalUsage", totalUsage);
        response.put("paymentBreakdown", paymentBreakdown);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/create-payment-plan")
    public ResponseEntity<?> createPaymentPlan(@RequestBody Map<String, Object> paymentPlanData) {
        // Extract data from request
        Long communityId = Long.parseLong(paymentPlanData.get("communityId").toString());
        Long userId = Long.parseLong(paymentPlanData.get("userId").toString());
        Double amount = Double.parseDouble(paymentPlanData.get("amount").toString());
        Boolean isInstallment = (Boolean) paymentPlanData.get("isInstallment");
        
        // Get the user and community
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        
        // Check if the user is a member of the community
        if (!communityMemberRepository.existsByCommunityAndUser(community, user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("User is not a member of this community"));
        }
        
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if the authenticated user is creating their own payment plan
        if (!userDetails.getId().equals(userId)) {
            return ResponseEntity.status(403).body(new MessageResponse("You are not authorized to create payment plans for other users"));
        }
        
        List<Payment> payments = new ArrayList<>();
        
        if (isInstallment) {
            // Create 12 monthly installments
            double installmentAmount = amount / 12;
            
            for (int i = 1; i <= 12; i++) {
                Payment payment = new Payment();
                payment.setUser(user);
                payment.setCommunity(community);
                payment.setAmount(installmentAmount);
                payment.setStatus(Payment.PaymentStatus.PENDING);
                payment.setInstallmentNumber(i);
                payment.setTotalInstallments(12);
                payment.setOriginalAmount(amount);
                payment.setTransactionId(UUID.randomUUID().toString());
                
                payments.add(payment);
            }
        } else {
            // Create a single full payment
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setCommunity(community);
            payment.setAmount(amount);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            payment.setInstallmentNumber(1);
            payment.setTotalInstallments(1);
            payment.setOriginalAmount(amount);
            payment.setTransactionId(UUID.randomUUID().toString());
            
            payments.add(payment);
        }
        
        // Save all payments
        List<Payment> savedPayments = paymentRepository.saveAll(payments);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment plan created successfully");
        response.put("payments", savedPayments);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentData) {
        // Extract data from request
        Long paymentId = Long.parseLong(paymentData.get("paymentId").toString());
        String paymentMethod = (String) paymentData.get("paymentMethod");
        
        // Get the payment
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if the authenticated user is making their own payment
        if (!userDetails.getId().equals(payment.getUser().getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("You are not authorized to process this payment"));
        }
        
        // Process the payment (in a real app, you would integrate with a payment gateway here)
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentMethod);
        
        Payment savedPayment = paymentRepository.save(payment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment processed successfully");
        response.put("payment", savedPayment);
        
        return ResponseEntity.ok(response);
    }
}
