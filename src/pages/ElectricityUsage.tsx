
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Zap, Loader2, Calculator, BarChart3, Save, DollarSign } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { dataCollectionAPI } from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BILL_PERIODS = [
  { id: 1, label: 'January-February', value: 'jan-feb' },
  { id: 2, label: 'March-April', value: 'mar-apr' },
  { id: 3, label: 'May-June', value: 'may-jun' },
  { id: 4, label: 'July-August', value: 'jul-aug' },
  { id: 5, label: 'September-October', value: 'sep-oct' },
  { id: 6, label: 'November-December', value: 'nov-dec' },
];

const usageSchema = z.object({
  bills: z.array(
    z.object({
      period: z.string(),
      units: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        { message: "Please enter a valid number of units" }
      ),
      amount: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        { message: "Please enter a valid amount" }
      ),
    })
  ),
});

const ElectricityUsage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/registration');
    }
  }, [isAuthenticated, navigate]);
  
  const form = useForm<z.infer<typeof usageSchema>>({
    resolver: zodResolver(usageSchema),
    defaultValues: {
      bills: BILL_PERIODS.map(period => ({
        period: period.value,
        units: '',
        amount: '',
      })),
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "bills",
  });

  const onSubmit = async (data: z.infer<typeof usageSchema>) => {
    setIsLoading(true);
    try {
      // Convert string values to numbers for API
      const formattedData = {
        ...data,
        bills: data.bills.map(bill => ({
          ...bill,
          units: Number(bill.units),
          amount: Number(bill.amount),
        })),
      };
      
      const response = await dataCollectionAPI.submitElectricityUsage(formattedData);
      
      if (response.error) {
        toast({
          title: "Submission failed",
          description: response.message || "There was an error submitting your electricity usage. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Data submitted successfully!",
        description: "Your electricity usage has been recorded. Proceeding to provider matching.",
        variant: "default",
      });
      
      // Navigate to provider matching page
      setTimeout(() => {
        navigate('/provider-matching');
      }, 2000);
    } catch (error) {
      console.error("Submit electricity usage error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your electricity usage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total units and amount
  const calculateTotal = (type: 'units' | 'amount') => {
    const values = form.getValues().bills;
    return values.reduce((total, bill) => {
      const value = Number(bill[type]) || 0;
      return total + value;
    }, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="rounded-full bg-primary/10 p-1">
              <Zap className="h-5 w-5 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Electricity Usage Data</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Enter Your Electricity Usage
          </h1>
          <p className="text-xl text-muted-foreground">
            Please provide your electricity usage for the last 6 billing periods to help us assess your solar needs.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Electricity Usage Details</CardTitle>
              <CardDescription>
                Enter the units consumed and bill amount for each two-month period
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <Alert className="bg-muted/60 border-muted">
                    <AlertTitle className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Why we need this data</span>
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      Your electricity usage helps us determine the optimal solar panel capacity for your community's needs. We'll use this to calculate potential savings and system requirements.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <Label>{BILL_PERIODS[index].label}</Label>
                        </div>
                        
                        <div className="col-span-4">
                          <FormField
                            control={form.control}
                            name={`bills.${index}.units`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      placeholder="0" 
                                      {...field} 
                                      className="pl-8" 
                                      type="number"
                                      min="0"
                                    />
                                  </FormControl>
                                  <Zap className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-4">
                          <FormField
                            control={form.control}
                            name={`bills.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      placeholder="0.00" 
                                      {...field} 
                                      className="pl-8" 
                                      type="number"
                                      min="0"
                                      step="0.01"
                                    />
                                  </FormControl>
                                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Total Units:</p>
                        <p className="text-2xl font-bold">{calculateTotal('units')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Total Amount:</p>
                        <p className="text-2xl font-bold">${calculateTotal('amount')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Submit Electricity Data
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default ElectricityUsage;
