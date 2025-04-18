
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { costAPI } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface QuoteBreakdownItem {
  userId: number;
  username: string;
  avgUsage: number;
  proportion: number;
  fullPaymentAmount: number;
  monthlyInstallment: number;
}

const QuoteSplitCalculator = ({ communityId }: { communityId: number }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [breakdown, setBreakdown] = useState<QuoteBreakdownItem[]>([]);
  const [userPayment, setUserPayment] = useState<QuoteBreakdownItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [paymentOption, setPaymentOption] = useState<string>('full');

  const calculateSplit = async () => {
    if (!quoteAmount || isNaN(parseFloat(quoteAmount)) || parseFloat(quoteAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid quote amount",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const result = await costAPI.calculateQuoteSplit({
        communityId,
        quoteAmount: parseFloat(quoteAmount),
      });
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.message || "Failed to calculate payment split",
          variant: "destructive",
        });
        return;
      }
      
      setBreakdown(result.paymentBreakdown);
      
      // Find the current user's payment
      if (user?.id) {
        const userItem = result.paymentBreakdown.find(item => item.userId === user.id);
        if (userItem) {
          setUserPayment(userItem);
        }
      }
      
      toast({
        title: "Calculation Complete",
        description: "Payment breakdown has been calculated based on electricity usage",
      });
    } catch (error) {
      console.error('Error calculating payment split:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const createPaymentPlan = async () => {
    if (!userPayment) {
      toast({
        title: "No Payment Information",
        description: "Please calculate your payment amount first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPlan(true);
    try {
      const result = await costAPI.createPaymentPlan({
        communityId,
        userId: user?.id,
        amount: userPayment.fullPaymentAmount,
        isInstallment: paymentOption === 'installment',
      });
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.message || "Failed to create payment plan",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Payment Plan Created",
        description: paymentOption === 'installment' 
          ? "12 monthly installment payments have been created" 
          : "Full payment has been created",
      });
      
      // After creating the plan, you can proceed to payment processing or redirect to another page
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlan(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quote Payment Calculator</CardTitle>
        <CardDescription>
          Calculate how the provider quote is split among community members based on their electricity usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="quoteAmount">Provider Quote Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quoteAmount"
                placeholder="Enter the total quote amount"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
              />
              <Button onClick={calculateSplit} disabled={isCalculating}>
                {isCalculating ? "Calculating..." : "Calculate Split"}
              </Button>
            </div>
          </div>

          {breakdown.length > 0 && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-sm font-medium">
                  <div>User</div>
                  <div>Avg. Usage</div>
                  <div>Full Payment</div>
                  <div>Monthly (12x)</div>
                </div>
                
                {breakdown.map((item) => (
                  <div 
                    key={item.userId}
                    className={`grid grid-cols-4 text-sm ${item.userId === user?.id ? "bg-green-50 p-2 rounded border border-green-200" : ""}`}
                  >
                    <div className="font-medium">{item.username} {item.userId === user?.id && "(You)"}</div>
                    <div>{item.avgUsage.toFixed(2)} kWh</div>
                    <div>₹{item.fullPaymentAmount.toFixed(2)}</div>
                    <div>₹{item.monthlyInstallment.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {userPayment && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Your Payment Options</h3>
              
              <Tabs defaultValue="full" onValueChange={setPaymentOption}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="full">Full Payment</TabsTrigger>
                  <TabsTrigger value="installment">12 Monthly Installments</TabsTrigger>
                </TabsList>
                <TabsContent value="full" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Full Payment</CardTitle>
                      <CardDescription>Pay the entire amount at once</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">₹{userPayment.fullPaymentAmount.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="installment" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Installments</CardTitle>
                      <CardDescription>Split into 12 equal monthly payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">₹{userPayment.monthlyInstallment.toFixed(2)} / month</p>
                      <p className="text-sm text-gray-500">Total: ₹{userPayment.fullPaymentAmount.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="net_banking">Net Banking</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </CardContent>
      {userPayment && (
        <CardFooter className="flex justify-end">
          <Button onClick={createPaymentPlan} disabled={isCreatingPlan}>
            {isCreatingPlan ? "Creating Plan..." : `Create ${paymentOption === 'installment' ? 'Installment' : 'Full'} Payment Plan`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuoteSplitCalculator;
