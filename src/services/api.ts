
import { toast } from "@/components/ui/use-toast";

// Define the base URL for our API
const API_BASE_URL = "http://localhost:8080/api";

// Define energy data interface
interface EnergyData {
  monthlyUsage: number;
  averageBill: number;
  homeSize: number;
  roofType: string;
  address: string;
}

// Define payment data interface
interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  paymentMethod: 'full' | 'installments';
  amount: number;
}

// Define member interface
export interface Member {
  name: string;
  allocation: number;
  systemShare: string;
  initialCost: string;
  monthlyContribution: string;
  status: string;
}

// Fetch community members
export const fetchCommunityMembers = async (): Promise<Member[]> => {
  try {
    // For now, return mock data
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/members`);
    // return await response.json();
    
    return [
      { 
        name: "Sarah Johnson", 
        allocation: 12.5, 
        systemShare: "6 kW", 
        initialCost: "₹3,75,000", 
        monthlyContribution: "₹1,750",
        status: "Paid"
      },
      { 
        name: "Michael Chen", 
        allocation: 10.4, 
        systemShare: "5 kW", 
        initialCost: "₹3,12,500", 
        monthlyContribution: "₹1,400",
        status: "Pending"
      },
      { 
        name: "Emma Davis", 
        allocation: 8.3, 
        systemShare: "4 kW", 
        initialCost: "₹2,50,000", 
        monthlyContribution: "₹1,100",
        status: "Paid"
      },
      { 
        name: "James Wilson", 
        allocation: 14.6, 
        systemShare: "7 kW", 
        initialCost: "₹4,37,500", 
        monthlyContribution: "₹2,000",
        status: "Paid"
      },
      { 
        name: "You", 
        allocation: 8.75, 
        systemShare: "4.2 kW", 
        initialCost: "₹2,62,500", 
        monthlyContribution: "₹1,200",
        status: "Pending"
      }
    ];
  } catch (error) {
    console.error("Error fetching community members:", error);
    toast({
      title: "Error",
      description: "Failed to fetch community members. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Submit energy data
export const submitEnergyData = async (data: EnergyData): Promise<boolean> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/energy-data`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // return response.ok;
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Energy data submitted:", data);
    toast({
      title: "Success",
      description: "Your energy data has been submitted successfully.",
    });
    return true;
  } catch (error) {
    console.error("Error submitting energy data:", error);
    toast({
      title: "Error",
      description: "Failed to submit energy data. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Process payment
export const processPayment = async (data: PaymentData): Promise<boolean> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/payments`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // return response.ok;
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Payment processed:", data);
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
    return true;
  } catch (error) {
    console.error("Error processing payment:", error);
    toast({
      title: "Payment Failed",
      description: "Failed to process payment. Please check your details and try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Register vote for provider
export const registerVote = async (providerId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/votes`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ providerId }),
    // });
    // return response.ok;
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("Vote registered for provider:", providerId);
    toast({
      title: "Vote Registered",
      description: "Your vote has been registered successfully.",
    });
    return true;
  } catch (error) {
    console.error("Error registering vote:", error);
    toast({
      title: "Error",
      description: "Failed to register your vote. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Contact provider
export const contactProvider = async (providerId: string, contactData: any): Promise<boolean> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/contact-provider`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ providerId, ...contactData }),
    // });
    // return response.ok;
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Contact request sent to provider:", providerId, contactData);
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the provider. They will contact you shortly.",
    });
    return true;
  } catch (error) {
    console.error("Error contacting provider:", error);
    toast({
      title: "Error",
      description: "Failed to send your message. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
