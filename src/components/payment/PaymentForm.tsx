
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { processPayment } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, LockKeyhole, BuildingBank } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  discountedAmount?: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, discountedAmount }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments'>('full');
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Form validation
  const isFormValid = 
    cardNumber.replace(/\s/g, '').length === 16 && 
    expiryDate.length === 5 && 
    cvv.length === 3 && 
    nameOnCard.length > 0;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Invalid Payment Details",
        description: "Please check your payment information and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    const paymentData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      nameOnCard,
      paymentMethod,
      amount: discountedAmount || amount,
    };
    
    const success = await processPayment(paymentData);
    
    setIsProcessing(false);
    
    if (success) {
      // Navigate to monitoring page after successful payment
      navigate('/monitoring');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <div className="relative">
            <Input 
              id="card-number" 
              placeholder="1234 5678 9012 3456" 
              className="pl-10" 
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input 
              id="expiry-date" 
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input 
                id="cvv" 
                placeholder="123" 
                className="pl-10"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={3}
                type="password"
              />
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name-on-card">Name on Card</Label>
          <div className="relative">
            <Input 
              id="name-on-card" 
              placeholder="John Doe"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="pl-10"
            />
            <BuildingBank className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <RadioGroup 
          defaultValue="full" 
          className="space-y-3"
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as 'full' | 'installments')}
        >
          <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
            <RadioGroupItem value="full" id="full-payment" />
            <Label htmlFor="full-payment" className="flex-1 font-medium">
              Full Payment
              <p className="text-sm font-normal text-muted-foreground">Pay the entire amount: ₹{discountedAmount?.toLocaleString() || amount.toLocaleString()}</p>
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
            <RadioGroupItem value="installments" id="installments" />
            <Label htmlFor="installments" className="flex-1 font-medium">
              Monthly Installments
              <p className="text-sm font-normal text-muted-foreground">
                12 payments of ₹{Math.round((discountedAmount || amount) / 12).toLocaleString()}/month
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
          disabled={!isFormValid || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Securely'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
