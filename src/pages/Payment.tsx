
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PaymentForm from '@/components/payment/PaymentForm';
import { DollarSign, CheckCircle2, Shield } from 'lucide-react';

const Payment = () => {
  // In a real app, this would come from previous steps, API or context
  // For now we'll simulate getting it from localStorage
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from localStorage (would be set in previous steps)
    const solarPlanData = localStorage.getItem('solarPlanData');
    
    if (solarPlanData) {
      setProjectData(JSON.parse(solarPlanData));
    } else {
      // Fallback data if nothing in localStorage
      setProjectData({
        projectId: 'CSP-' + Math.floor(10000 + Math.random() * 90000),
        totalAmount: 150000,
        initialPayment: 45000,
        monthlyPayment: 2500,
        systemSize: '5kW',
        estimatedProduction: '7,500 kWh/year',
        estimatedSavings: '₹12,000/year'
      });
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="rounded-full bg-primary/10 p-1">
              <DollarSign className="h-4 w-4 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Payment & Financing</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Complete Your Community Solar Investment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review your solar plan details and complete your payment to join the community solar project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="animate-slide-in-right">
            <Card className="shadow-soft overflow-hidden">
              <div className="bg-primary/5 p-6">
                <h2 className="text-2xl font-semibold">Project Summary</h2>
                <p className="text-muted-foreground">Project ID: {projectData.projectId}</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">System Size:</span>
                    <span>{projectData.systemSize}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Estimated Production:</span>
                    <span>{projectData.estimatedProduction}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Estimated Annual Savings:</span>
                    <span>{projectData.estimatedSavings}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Initial Payment:</span>
                    <span className="font-semibold">₹{projectData.initialPayment.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Monthly Contribution:</span>
                    <span>₹{projectData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-lg">
                    <span className="font-semibold">Total Project Cost:</span>
                    <span className="font-bold text-primary">₹{projectData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-8 bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Payment Protection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment is secured and you're covered by our 25-year warranty and performance guarantee.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">No Hidden Costs</h3>
                  <p className="text-sm text-muted-foreground">All taxes, installation, and maintenance costs are included in the price.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Flexible Payment Options</h3>
                  <p className="text-sm text-muted-foreground">Choose from multiple payment methods to suit your needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Guaranteed Returns</h3>
                  <p className="text-sm text-muted-foreground">Your investment is protected with our solar performance guarantee.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-slide-in-left">
            <PaymentForm 
              amount={projectData.initialPayment} 
              projectId={projectData.projectId} 
            />
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              By proceeding with payment, you agree to our 
              <span className="text-primary font-medium cursor-pointer mx-1">Terms & Conditions</span> 
              and 
              <span className="text-primary font-medium cursor-pointer ml-1">Privacy Policy</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Payment;
