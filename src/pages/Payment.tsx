
import React from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Users, DollarSign, LockKeyhole, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExportDistributionReportButton from '@/components/reports/DistributionReport';

// Define the member type
type Member = {
  name: string;
  allocation: number;
  systemShare: string;
  initialCost: string;
  monthlyContribution: string;
  status: string;
};

const Payment = () => {
  // Sample data for community members
  const communityMembers: Member[] = [
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
  
  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="space-y-6 max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center space-x-2">
            <span className="rounded-full bg-primary/10 p-1">
              <CreditCard className="h-4 w-4 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Payment & Cost-Sharing</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Secure & Transparent Payments
          </h1>
          <p className="text-xl text-muted-foreground">
            Handle payments securely and distribute costs fairly among community members.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="payment">Secure Payment</TabsTrigger>
              <TabsTrigger value="cost-sharing">Cost Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-soft animate-slide-in-right">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                      Complete your secure payment for the solar installation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <Input id="card-number" placeholder="1234 5678 9012 3456" className="pl-10" />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input id="expiry-date" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Input id="cvv" placeholder="123" className="pl-10" />
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="John Doe" />
                    </div>
                    <RadioGroup defaultValue="full" className="space-y-3">
                      <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <RadioGroupItem value="full" id="full-payment" />
                        <Label htmlFor="full-payment" className="flex-1 font-medium">
                          Full Payment
                          <p className="text-sm font-normal text-muted-foreground">Pay the entire amount: ₹2,62,500</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <RadioGroupItem value="installments" id="installments" />
                        <Label htmlFor="installments" className="flex-1 font-medium">
                          Monthly Installments
                          <p className="text-sm font-normal text-muted-foreground">12 payments of ₹22,917/month</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                      Pay Securely
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-soft animate-slide-in-left">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      Review your contribution to the community solar project.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <h3 className="font-medium mb-2">Community Solar Project</h3>
                      <p className="text-sm text-muted-foreground mb-4">Maple Street Community Solar - 48kW System</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Your allocation:</span>
                          <span className="font-medium">4.2kW (8.75%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>System cost:</span>
                          <span className="font-medium">₹2,47,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Installation fee:</span>
                          <span className="font-medium">₹12,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maintenance deposit:</span>
                          <span className="font-medium">₹2,500</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">₹2,62,500</span>
                      </div>
                      <div className="flex justify-between text-primary">
                        <span>Tax incentives & rebates:</span>
                        <span className="font-medium">-₹78,750</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-3">
                        <span>Final cost:</span>
                        <span>₹1,83,750</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Estimated Annual Savings</h4>
                          <p className="text-sm text-muted-foreground">
                            Based on your current energy usage, you'll save approximately ₹41,000 per year on your electricity bill.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="button-animation">
                      <ArrowRight className="h-4 w-4 mr-2" /> Return to Details
                    </Button>
                    <Link to="/monitoring">
                      <Button className="button-animation">
                        Continue
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cost-sharing" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-soft mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Community Cost Distribution
                    </CardTitle>
                    <CardDescription>
                      See how costs are distributed among community members based on usage and allocation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Member</th>
                            <th className="text-center py-3 px-4">Allocation %</th>
                            <th className="text-center py-3 px-4">System Share</th>
                            <th className="text-center py-3 px-4">Initial Cost</th>
                            <th className="text-center py-3 px-4">Monthly Contribution</th>
                            <th className="text-right py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {communityMembers.map((member, index) => (
                            <tr 
                              key={index} 
                              className={`border-b ${member.name === "You" ? "bg-primary/5" : ""}`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {member.name}
                                {member.name === "You" && <span className="text-primary text-xs ml-2">(You)</span>}
                              </td>
                              <td className="text-center py-3 px-4">{member.allocation}%</td>
                              <td className="text-center py-3 px-4">{member.systemShare}</td>
                              <td className="text-center py-3 px-4">{member.initialCost}</td>
                              <td className="text-center py-3 px-4">{member.monthlyContribution}</td>
                              <td className="text-right py-3 px-4">
                                <Badge 
                                  className={
                                    member.status === "Paid" 
                                      ? "bg-eco-500" 
                                      : "bg-solar-500"
                                  }
                                >
                                  {member.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start space-y-4">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 w-full">
                      <h3 className="font-medium mb-2">Cost Distribution Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Costs are distributed based on each member's energy consumption needs and the percentage of the system allocated to them. Monthly contributions cover maintenance and insurance costs.
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <ExportDistributionReportButton members={communityMembers} />
                      <Button className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                        Adjust Your Allocation
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${className}`}>
      {children}
    </span>
  );
};

export default Payment;
