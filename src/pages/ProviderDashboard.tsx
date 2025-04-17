
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { providerAPI } from '@/services/api';
import { CalendarClock, Check, DollarSign, Buildings, Users, MessageSquare, Clipboard, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProviderDashboard = () => {
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is a provider, if not redirect to home
    if (user && !user.roles?.includes('ROLE_PROVIDER')) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You need to be registered as a provider to access this page.",
        variant: "destructive"
      });
    }
    
    // Load quote requests from mock data for now
    const mockQuoteRequests = [
      {
        id: 'req-001',
        communityName: 'Green Valley Community',
        location: 'Bangalore, Karnataka',
        memberCount: 32,
        averageUsage: 450,
        totalUsage: 14400,
        requestDate: '2023-10-15',
        status: 'pending',
        details: {
          roofArea: '1200 sq.m',
          shadingFactor: 'Low',
          averageSunlight: '5.8 hrs/day',
          preferredInstallation: 'December 2023'
        }
      },
      {
        id: 'req-002',
        communityName: 'Sunrise Apartments',
        location: 'Chennai, Tamil Nadu',
        memberCount: 24,
        averageUsage: 380,
        totalUsage: 9120,
        requestDate: '2023-10-20',
        status: 'pending',
        details: {
          roofArea: '950 sq.m',
          shadingFactor: 'Medium',
          averageSunlight: '6.2 hrs/day',
          preferredInstallation: 'January 2024'
        }
      },
      {
        id: 'req-003',
        communityName: 'Harmony Heights',
        location: 'Mumbai, Maharashtra',
        memberCount: 48,
        averageUsage: 520,
        totalUsage: 24960,
        requestDate: '2023-10-22',
        status: 'pending',
        details: {
          roofArea: '1850 sq.m',
          shadingFactor: 'Low',
          averageSunlight: '5.5 hrs/day',
          preferredInstallation: 'February 2024'
        }
      }
    ];
    
    const mockActiveProjects = [
      {
        id: 'proj-001',
        communityName: 'Eco Residency',
        location: 'Delhi, NCR',
        memberCount: 40,
        installationProgress: 65,
        startDate: '2023-09-01',
        estimatedCompletion: '2023-11-15',
        status: 'in-progress'
      }
    ];
    
    setQuoteRequests(mockQuoteRequests);
    setActiveProjects(mockActiveProjects);
    
    // In a real app, we would fetch from the API
    // async function fetchRequests() {
    //   const response = await providerAPI.getQuoteRequests();
    //   if (!response.error) {
    //     setQuoteRequests(response);
    //   }
    // }
    // 
    // async function fetchProjects() {
    //   const response = await providerAPI.getActiveProjects();
    //   if (!response.error) {
    //     setActiveProjects(response);
    //   }
    // }
    // 
    // fetchRequests();
    // fetchProjects();
  }, [user, navigate, toast]);

  const handleSubmitQuote = (requestId) => {
    const amount = parseFloat(quoteAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid quote amount.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would call the API
    // providerAPI.submitQuote(requestId, { amount })
    //   .then(response => {
    //     if (!response.error) {
    //       setQuoteSubmitted(true);
    //       toast({
    //         title: "Quote Submitted",
    //         description: "Your quote has been submitted successfully."
    //       });
    //     }
    //   });
    
    // Mock successful submission
    setQuoteSubmitted(true);
    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted successfully."
    });
    
    // Update the local state
    setQuoteRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: 'quoted', quoteAmount: amount } 
          : req
      )
    );
    
    // Reset the dialog state after a delay
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteAmount('');
      setSelectedRequest(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Section className="pt-24 pb-16">
        <div className="space-y-6 max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Provider Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage quote requests, active projects, and track installation progress.
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="quote-requests" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="quote-requests">Quote Requests</TabsTrigger>
              <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="quote-requests" className="animate-fade-in">
              <div className="grid gap-6">
                {quoteRequests.length > 0 ? (
                  quoteRequests.map((request, index) => (
                    <Card key={request.id} className="shadow-md overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{request.communityName}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Buildings className="h-4 w-4 mr-1" />
                              {request.location}
                            </CardDescription>
                          </div>
                          <Badge variant={request.status === 'pending' ? "outline" : "secondary"}>
                            {request.status === 'pending' ? 'New Request' : 'Quote Submitted'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Members</p>
                            <p className="font-medium">{request.memberCount}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <BarChart className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Avg. Usage</p>
                            <p className="font-medium">{request.averageUsage} kWh</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <CalendarClock className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Requested On</p>
                            <p className="font-medium">{request.requestDate}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-2">
                          <h4 className="font-medium text-sm mb-2">Installation Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {Object.entries(request.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground">
                                  {key.replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase())}:
                                </span>
                                <p className="font-medium">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/20 flex justify-end">
                        {request.status === 'pending' ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedRequest(request)}
                                className="bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                              >
                                <DollarSign className="h-4 w-4 mr-2" /> Submit Quote
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {!quoteSubmitted ? (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Submit Price Quote</DialogTitle>
                                    <DialogDescription>
                                      Provide your price quote for {selectedRequest?.communityName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="quote-amount" className="text-right">Total Cost</Label>
                                      <div className="relative col-span-3">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          id="quote-amount"
                                          value={quoteAmount}
                                          onChange={(e) => setQuoteAmount(e.target.value)}
                                          placeholder="Enter quote amount"
                                          className="pl-10"
                                        />
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      This is the total installation cost for the entire community. Individual members will pay their share based on energy allocation.
                                    </p>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button onClick={() => handleSubmitQuote(selectedRequest?.id)}>
                                      Submit Quote
                                    </Button>
                                  </DialogFooter>
                                </>
                              ) : (
                                <div className="py-6 text-center">
                                  <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
                                  <h3 className="text-xl font-medium mb-2">Quote Submitted!</h3>
                                  <p className="text-muted-foreground">
                                    Your quote has been sent to {selectedRequest?.communityName}.
                                    You'll be notified when they make a decision.
                                  </p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="flex items-center text-muted-foreground">
                            <Check className="h-4 w-4 mr-1 text-green-500" />
                            <span>Quote submitted: ₹{request.quoteAmount?.toLocaleString()}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-md">
                    <CardContent className="py-16 text-center">
                      <Clipboard className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium">No Quote Requests</h3>
                      <p className="text-muted-foreground mt-2">
                        You don't have any pending quote requests from communities.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active-projects" className="animate-fade-in">
              <div className="grid gap-6">
                {activeProjects.length > 0 ? (
                  activeProjects.map((project) => (
                    <Card key={project.id} className="shadow-md overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{project.communityName}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Buildings className="h-4 w-4 mr-1" />
                              {project.location}
                            </CardDescription>
                          </div>
                          <Badge variant="default" className="bg-solar-500">
                            In Progress
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Installation Progress</span>
                            <span className="text-sm font-medium">{project.installationProgress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-solar-500 to-eco-500 h-2.5 rounded-full" 
                              style={{ width: `${project.installationProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Members</p>
                            <p className="font-medium">{project.memberCount}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <CalendarClock className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">{project.startDate}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <CalendarClock className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-sm text-muted-foreground">Completion</p>
                            <p className="font-medium">{project.estimatedCompletion}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/20 flex justify-end">
                        <Button variant="outline" className="mr-2">
                          <MessageSquare className="h-4 w-4 mr-2" /> Message Community
                        </Button>
                        <Button>Update Progress</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-md">
                    <CardContent className="py-16 text-center">
                      <Clipboard className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium">No Active Projects</h3>
                      <p className="text-muted-foreground mt-2">
                        You don't have any active installation projects.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <Card className="shadow-md">
                <CardContent className="py-16 text-center">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-medium">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground mt-2">
                    View detailed analytics about your projects and performance metrics.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </div>
  );
};

export default ProviderDashboard;
