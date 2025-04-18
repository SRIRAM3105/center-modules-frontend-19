
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { costAPI, communityAPI } from '@/services/api';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import QuoteSplitCalculator from '@/components/payment/QuoteSplitCalculator';

const Payment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCommunities, setUserCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!user?.id) return;
      
      try {
        const communities = await communityAPI.getUserCommunities();
        if (!communities.error && communities.length > 0) {
          setUserCommunities(communities);
          setSelectedCommunity(communities[0]);
        }
      } catch (error) {
        console.error('Error fetching user communities:', error);
        toast({
          title: "Error",
          description: "Failed to load your communities",
          variant: "destructive",
        });
      }
    };

    fetchUserCommunities();
  }, [user, toast]);

  useEffect(() => {
    const fetchUserPayments = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userPayments = await costAPI.getPayments(user.id);
        if (!userPayments.error) {
          setPayments(userPayments);
        }
      } catch (error) {
        console.error('Error fetching user payments:', error);
        toast({
          title: "Error",
          description: "Failed to load your payment history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPayments();
  }, [user, toast]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your community solar payments and view payment history
        </p>
      </div>

      <Tabs defaultValue="quote">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="quote">Quote Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quote" className="space-y-4">
          {selectedCommunity ? (
            <QuoteSplitCalculator communityId={selectedCommunity.id} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Communities</CardTitle>
                <CardDescription>
                  You need to join a community before you can make payments.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your past payments for community solar projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading payment history...</p>
              ) : payments.length > 0 ? (
                <div className="space-y-4">
                  {payments
                    .filter(payment => payment.status === 'COMPLETED')
                    .map((payment, index) => (
                      <div key={payment.id || index} className="p-4 border rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{payment.community?.name || 'Unknown Community'}</div>
                          <div className="font-bold">₹{payment.amount.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <div>
                            {payment.installmentNumber && payment.totalInstallments 
                              ? `Installment ${payment.installmentNumber} of ${payment.totalInstallments}` 
                              : 'Full Payment'}
                          </div>
                          <div>{new Date(payment.paymentDate).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {payment.paymentMethod || 'Unknown Method'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No payment history found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>
                View your upcoming installment payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading upcoming payments...</p>
              ) : payments.length > 0 ? (
                <div className="space-y-4">
                  {payments
                    .filter(payment => payment.status === 'PENDING')
                    .map((payment, index) => (
                      <div key={payment.id || index} className="p-4 border rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{payment.community?.name || 'Unknown Community'}</div>
                          <div className="font-bold">₹{payment.amount.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <div>
                            {payment.installmentNumber && payment.totalInstallments 
                              ? `Installment ${payment.installmentNumber} of ${payment.totalInstallments}` 
                              : 'Full Payment'}
                          </div>
                          <div>Due {new Date().toLocaleDateString()}</div>
                        </div>
                        <div className="mt-2">
                          <button className="bg-primary text-white px-3 py-1 rounded text-sm">
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No upcoming payments found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
