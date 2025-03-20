
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, CreditCard, Bank } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const PaymentForm = ({ amount, projectId }: { amount: number; projectId: string }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentTab, setPaymentTab] = useState('card');
  
  const [formData, setFormData] = useState({
    // Credit card details
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Bank transfer details
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    
    // Common details
    email: '',
    phone: '',
    billingAddress: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form based on payment method
    if (paymentTab === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill out all required card details.",
        });
        return;
      }
    } else if (paymentTab === 'bank') {
      if (!formData.accountName || !formData.accountNumber || !formData.ifscCode || !formData.bankName) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill out all required bank details.",
        });
        return;
      }
    }
    
    // Validate common fields
    if (!formData.email || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide your contact information.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare payment data to send to backend
      const paymentData = {
        amount,
        projectId,
        paymentMethod: paymentTab,
        ...formData,
        timestamp: new Date().toISOString(),
      };
      
      // Send to Spring Boot backend
      const response = await processPayment(paymentData);
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: `Your payment of ₹${amount.toLocaleString()} has been processed. Reference ID: ${response.transactionId}`,
      });
      
      // Store transaction details in localStorage
      localStorage.setItem('paymentConfirmation', JSON.stringify(response));
      
      // Redirect to monitoring page
      setTimeout(() => {
        navigate('/monitoring');
      }, 2000);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was a problem processing your payment. Please try again or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-soft">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>Amount due: ₹{amount.toLocaleString()}</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={paymentTab} onValueChange={setPaymentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" />
              Credit Card
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Bank className="mr-2 h-4 w-4" />
              Bank Transfer
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6 space-y-4">
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input 
                  id="cardName" 
                  placeholder="John Doe" 
                  value={formData.cardName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    placeholder="MM/YY" 
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    type="password" 
                    placeholder="123" 
                    value={formData.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bank" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input 
                  id="accountName" 
                  placeholder="John Doe" 
                  value={formData.accountName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  placeholder="1234567890" 
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input 
                  id="ifscCode" 
                  placeholder="ABCD0123456" 
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName" 
                  placeholder="State Bank of India" 
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+91 1234567890" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Textarea 
                id="billingAddress" 
                placeholder="Enter your billing address" 
                value={formData.billingAddress}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Payment
                </span>
              )}
            </Button>
          </CardFooter>
        </Tabs>
      </form>
    </Card>
  );
};

export default PaymentForm;
