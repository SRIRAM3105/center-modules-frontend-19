
import React, { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart2, Home, Sun, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { submitEnergyData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const DataCollection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthlyUsage: '',
    averageBill: '',
    homeSize: 1500,
    roofType: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, homeSize: value[0] }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, roofType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.monthlyUsage || !formData.averageBill || !formData.roofType || !formData.address) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields before submitting.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Process the data to ensure numbers are properly formatted
      const dataToSubmit = {
        ...formData,
        monthlyUsage: parseFloat(formData.monthlyUsage),
        averageBill: parseFloat(formData.averageBill)
      };
      
      // Submit to Spring Boot backend
      const response = await submitEnergyData(dataToSubmit);
      
      toast({
        title: "Data Submitted Successfully",
        description: "Your energy consumption data has been processed.",
      });
      
      // Store the response data in localStorage for use in other pages
      localStorage.setItem('solarPlanData', JSON.stringify(response));
      
      // Navigate to the next page
      navigate('/provider-matching');
    } catch (error) {
      console.error('Error submitting energy data:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem sending your data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-right">
            <div className="inline-flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <BarChart2 className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Data Collection & Solar Plan</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Customize Your Solar Solution
            </h1>
            <p className="text-xl text-muted-foreground">
              Share your energy usage data to get a personalized solar plan and cost estimation for your community project.
            </p>
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Household Data</h3>
                  <p className="text-sm text-muted-foreground">Enter your home energy usage</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Cost Estimation</h3>
                  <p className="text-sm text-muted-foreground">Get detailed cost breakdowns</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto animate-slide-in-left">
            <Card className="shadow-soft">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Energy Consumption Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyUsage">Monthly Usage (kWh)</Label>
                      <Input 
                        id="monthlyUsage" 
                        type="number" 
                        placeholder="e.g. 850" 
                        value={formData.monthlyUsage}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageBill">Average Monthly Bill (₹)</Label>
                      <Input 
                        id="averageBill" 
                        type="number" 
                        placeholder="e.g. 7,500" 
                        value={formData.averageBill}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Home Size (sq ft)</Label>
                      <div className="pt-4 pb-2">
                        <Slider 
                          defaultValue={[1500]} 
                          value={[formData.homeSize]}
                          onValueChange={handleSliderChange}
                          max={5000} 
                          step={100} 
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>500</span>
                        <span>{formData.homeSize}</span>
                        <span>5000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Select onValueChange={handleSelectChange} value={formData.roofType}>
                      <SelectTrigger id="roofType">
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat Roof</SelectItem>
                        <SelectItem value="sloped">Sloped Roof</SelectItem>
                        <SelectItem value="metal">Metal Roof</SelectItem>
                        <SelectItem value="tile">Tile Roof</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Enter your address" 
                      value={formData.address}
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
                    {loading ? 'Processing...' : 'Calculate Solar Plan'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-elegant animate-slide-in-right">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Solar panel calculation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6 animate-slide-in-left">
            <h2 className="section-title">Cost Estimation for Shared Solar</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our advanced algorithm calculates the optimal solar system size for your community and provides a detailed cost breakdown including installation, maintenance, and potential savings.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Sun className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Precision System Sizing</h3>
                  <p className="text-muted-foreground">
                    Based on the combined energy needs of your community, we calculate the exact system size needed to maximize efficiency.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparent Cost Breakdown</h3>
                  <p className="text-muted-foreground">
                    Get a clear view of all costs involved, including equipment, installation, permits, and ongoing maintenance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Long-term Savings Projection</h3>
                  <p className="text-muted-foreground">
                    Visualize your potential savings over time, including tax incentives and reduced utility bills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default DataCollection;
