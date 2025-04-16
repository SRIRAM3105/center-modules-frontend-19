import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { communityAPI, providerAPI, costAPI } from '@/services/api';
import { Building2, Users, Zap, CheckCircle, AlertCircle, Phone, CreditCard, Timer, Vote } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Define interface for voting results to avoid type errors
interface VotingResults {
  isOpen: boolean;
  winner?: number;
  results?: Record<string, number>;
}

const CostSharing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userCommunities, setUserCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [providers, setProviders] = useState([]);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [electricityUsage, setElectricityUsage] = useState([]);
  const [totalElectricityUnits, setTotalElectricityUnits] = useState(0);
  const [averageMonthlyUsage, setAverageMonthlyUsage] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [votingOpen, setVotingOpen] = useState(false);
  const [votingResults, setVotingResults] = useState<VotingResults>({ isOpen: false });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({
    communities: false,
    providers: false,
    quotes: false,
    voting: false,
    payment: false
  });

  // Load user communities
  useEffect(() => {
    const loadUserCommunities = async () => {
      setLoading(prev => ({ ...prev, communities: true }));
      try {
        const communities = await communityAPI.getUserCommunities();
        if (!communities.error) {
          setUserCommunities(communities);
          if (communities.length > 0) {
            setSelectedCommunity(communities[0]);
          }
        }
      } catch (error) {
        console.error("Error loading communities:", error);
        toast({
          title: "Error",
          description: "Failed to load your communities. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, communities: false }));
      }
    };

    loadUserCommunities();
  }, []);

  // When a community is selected, load community details
  useEffect(() => {
    if (!selectedCommunity) return;
    
    const loadCommunityDetails = async () => {
      try {
        // Check if user is admin of the community
        const isUserAdmin = selectedCommunity.adminId === user.id || 
                           (selectedCommunity.members && 
                            selectedCommunity.members.find(m => m.userId === user.id && m.role === 'ADMIN'));
        setIsAdmin(isUserAdmin);
        
        // Load community members
        const members = await communityAPI.getCommunityDetails(selectedCommunity.id);
        if (!members.error && members.members) {
          setCommunityMembers(members.members);
        }
        
        // Load electricity usage for the community
        const usageData = await communityAPI.getCommunityDetails(selectedCommunity.id);
        if (!usageData.error && usageData.electricityUsage) {
          setElectricityUsage(usageData.electricityUsage);
          
          // Calculate total and average usage
          const totalUnits = usageData.electricityUsage.reduce((sum, data) => sum + data.totalUnits, 0);
          setTotalElectricityUnits(totalUnits);
          setAverageMonthlyUsage(totalUnits / 6); // 6 months of data
        }
        
        // Load existing quotes if any
        const existingQuotes = await providerAPI.getProviders();
        if (!existingQuotes.error && existingQuotes.quotes) {
          const communityQuotes = existingQuotes.quotes.filter(q => q.communityId === selectedCommunity.id);
          setQuotes(communityQuotes);
        }
        
        // Load voting results if any
        const votingData = await providerAPI.getVotingResults(selectedCommunity.id);
        if (!votingData.error) {
          setVotingResults(votingData || { isOpen: false });
          setVotingOpen(votingData.isOpen || false);
        }
        
      } catch (error) {
        console.error("Error loading community details:", error);
      }
    };
    
    loadCommunityDetails();
  }, [selectedCommunity]);

  // Load providers list
  useEffect(() => {
    const loadProviders = async () => {
      setLoading(prev => ({ ...prev, providers: true }));
      try {
        const providersData = await providerAPI.getProviders();
        if (!providersData.error) {
          setProviders(providersData);
        }
      } catch (error) {
        console.error("Error loading providers:", error);
      } finally {
        setLoading(prev => ({ ...prev, providers: false }));
      }
    };
    
    loadProviders();
  }, []);

  const handleCommunityChange = (community) => {
    setSelectedCommunity(community);
  };

  const requestQuote = async (providerId) => {
    setLoading(prev => ({ ...prev, quotes: true }));
    try {
      const quoteData = {
        communityId: selectedCommunity.id,
        providerId,
        monthlyUsage: averageMonthlyUsage,
        numMembers: communityMembers.length
      };
      
      const response = await providerAPI.requestQuote(providerId, quoteData);
      
      if (!response.error) {
        toast({
          title: "Quote Requested",
          description: "Your quote request has been sent to the provider.",
        });
        
        // Add new quote to the list
        setQuotes(prev => [...prev, response]);
      } else {
        toast({
          title: "Request Failed",
          description: response.message || "Failed to request quote. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting quote:", error);
      toast({
        title: "Request Failed",
        description: "An error occurred while requesting the quote.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, quotes: false }));
    }
  };

  const startVoting = async () => {
    if (!isAdmin) return;
    
    try {
      const response = await providerAPI.submitVote(selectedCommunity.id, { action: 'start_voting' });
      
      if (!response.error) {
        setVotingOpen(true);
        toast({
          title: "Voting Started",
          description: "Community members can now vote for their preferred provider.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to start voting process.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error starting voting:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to start the voting process.",
        variant: "destructive"
      });
    }
  };

  const submitVote = async (providerId) => {
    setLoading(prev => ({ ...prev, voting: true }));
    try {
      const response = await providerAPI.submitVote(selectedCommunity.id, { providerId });
      
      if (!response.error) {
        toast({
          title: "Vote Submitted",
          description: "Your vote has been recorded successfully.",
        });
        
        // Refresh voting results
        const updatedResults = await providerAPI.getVotingResults(selectedCommunity.id);
        if (!updatedResults.error) {
          setVotingResults(updatedResults);
        }
      } else {
        toast({
          title: "Voting Failed",
          description: response.message || "Failed to submit your vote. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Voting Failed",
        description: "An error occurred while submitting your vote.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, voting: false }));
    }
  };

  const makePayment = async (paymentMethod, amount) => {
    setLoading(prev => ({ ...prev, payment: true }));
    try {
      const paymentData = {
        communityId: selectedCommunity.id,
        userId: user.id,
        amount,
        paymentMethod
      };
      
      const response = await costAPI.makePayment(paymentData);
      
      if (!response.error) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        setPaymentOpen(false);
      } else {
        toast({
          title: "Payment Failed",
          description: response.message || "Failed to process your payment. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing your payment.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, payment: false }));
    }
  };

  const calculateUserShare = (userUsage, totalUsage, totalCost) => {
    if (totalUsage === 0) return 0;
    const share = (userUsage / totalUsage) * totalCost;
    return Math.round(share * 100) / 100; // Round to 2 decimal places
  };

  // Determine if voting is complete and a provider has been selected
  const votingComplete = votingResults.winner !== undefined;
  const winningProvider = votingComplete ? providers.find(p => p.id === votingResults.winner) : null;

  // Get user's electricity usage
  const userUsage = electricityUsage.find(e => e.userId === user.id);
  const userMonthlyAverage = userUsage ? userUsage.totalUnits / 6 : 0; // 6 months

  // Calculate user's share if a provider has been selected
  const winningQuote = votingComplete && quotes.find(q => q.providerId === votingResults.winner);
  const userShareAmount = winningQuote 
    ? calculateUserShare(userMonthlyAverage, averageMonthlyUsage, winningQuote.totalCost)
    : 0;

  
  return (
    <div className="min-h-screen py-16">
      <Section>
        <div className="container max-w-6xl">
          <div className="flex items-center mb-8">
            <Building2 className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold">Community Solar Cost Sharing</h1>
          </div>

          {userCommunities.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Users className="h-16 w-16 mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Communities Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to join or create a community before you can access cost sharing features.
                  </p>
                  <Button onClick={() => navigate('/community')} className="mt-2">
                    Go to Communities
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            
            <>
              {/* Community Selection */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Communities</CardTitle>
                  <CardDescription>
                    Select a community to manage cost sharing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCommunities.map((community) => (
                      <Card 
                        key={community.id} 
                        className={`cursor-pointer transition-all ${
                          selectedCommunity?.id === community.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleCommunityChange(community)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start">
                            <Building2 className="h-5 w-5 mt-1 mr-3 text-primary" />
                            <div>
                              <h3 className="font-semibold">{community.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {community.location}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {community.members?.length || 0} members
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedCommunity && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="providers" disabled={!isAdmin}>
                      Providers {!isAdmin && "(Admin Only)"}
                    </TabsTrigger>
                    <TabsTrigger value="voting" disabled={!votingOpen && !votingComplete}>
                      Voting {(!votingOpen && !votingComplete) && "(Not Started)"}
                    </TabsTrigger>
                    <TabsTrigger value="payment" disabled={!votingComplete}>
                      Payment {!votingComplete && "(Not Ready)"}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Community Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                              <dd>{selectedCommunity.name}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                              <dd>{selectedCommunity.location}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Members</dt>
                              <dd>{communityMembers.length}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Admin</dt>
                              <dd>{isAdmin ? "You" : "Other"}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Electricity Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Total Monthly Usage</dt>
                              <dd>{averageMonthlyUsage.toFixed(2)} kWh</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Your Monthly Usage</dt>
                              <dd>{userMonthlyAverage.toFixed(2)} kWh</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Your Usage %</dt>
                              <dd>{averageMonthlyUsage ? ((userMonthlyAverage / averageMonthlyUsage) * 100).toFixed(1) : 0}%</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Usage Data Period</dt>
                              <dd>Last 6 months</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Installation Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{getStagePercentage()}%</span>
                            </div>
                            <Progress value={getStagePercentage()} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className={getStageClassName(1)}>
                              <CardContent className="p-4 text-center">
                                <div className="flex justify-center mb-2">
                                  <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium">Data Collection</h3>
                                <p className="text-xs mt-1">Complete</p>
                              </CardContent>
                            </Card>
                            
                            <Card className={getStageClassName(2)}>
                              <CardContent className="p-4 text-center">
                                <div className="flex justify-center mb-2">
                                  <Building2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium">Provider Selection</h3>
                                <p className="text-xs mt-1">
                                  {isAdmin && quotes.length === 0 ? "Waiting for Admin" : 
                                   quotes.length > 0 ? "Quotes Received" : "Not Started"}
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card className={getStageClassName(3)}>
                              <CardContent className="p-4 text-center">
                                <div className="flex justify-center mb-2">
                                  <Vote className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium">Community Voting</h3>
                                <p className="text-xs mt-1">
                                  {votingComplete ? "Complete" : 
                                   votingOpen ? "In Progress" : "Not Started"}
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card className={getStageClassName(4)}>
                              <CardContent className="p-4 text-center">
                                <div className="flex justify-center mb-2">
                                  <CreditCard className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium">Payment</h3>
                                <p className="text-xs mt-1">
                                  {votingComplete ? "Ready" : "Waiting for Voting"}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {isAdmin && quotes.length === 0 && (
                            <div className="flex justify-center mt-6">
                              <Button onClick={() => setActiveTab('providers')}>
                                Request Provider Quotes
                              </Button>
                            </div>
                          )}
                          
                          {votingOpen && !votingComplete && (
                            <div className="flex justify-center mt-6">
                              <Button onClick={() => setActiveTab('voting')}>
                                Vote for Provider
                              </Button>
                            </div>
                          )}
                          
                          {votingComplete && (
                            <div className="flex justify-center mt-6">
                              <Button onClick={() => setActiveTab('payment')}>
                                Proceed to Payment
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Providers Tab (Admin Only) */}
                  <TabsContent value="providers">
                    <Card>
                      <CardHeader>
                        <CardTitle>Solar Providers</CardTitle>
                        <CardDescription>
                          As the community admin, you can request quotes from solar providers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading.providers ? (
                          <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="rounded-md border">
                              <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium border-b">
                                <div className="col-span-2">Provider</div>
                                <div>Experience</div>
                                <div>Rating</div>
                                <div>Actions</div>
                              </div>
                              {providers.map((provider) => (
                                <div key={provider.id} className="grid grid-cols-1 md:grid-cols-5 p-4 border-b last:border-0 items-center gap-4 md:gap-0">
                                  <div className="col-span-2">
                                    <div className="font-medium">{provider.name}</div>
                                    <div className="text-sm text-muted-foreground">{provider.location}</div>
                                  </div>
                                  <div>{provider.yearsExperience || "N/A"} years</div>
                                  <div>{provider.averageRating ? `${provider.averageRating.toFixed(1)}/5` : "No ratings"}</div>
                                  <div>
                                    {quotes.some(q => q.providerId === provider.id) ? (
                                      <Button variant="outline" size="sm" disabled>
                                        Quote Requested
                                      </Button>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        onClick={() => requestQuote(provider.id)}
                                        disabled={loading.quotes}
                                      >
                                        {loading.quotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Request Quote
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {quotes.length > 0 && (
                              <div className="space-y-4 mt-8">
                                <h3 className="text-lg font-semibold">Received Quotes</h3>
                                <div className="rounded-md border">
                                  <div className="grid grid-cols-1 md:grid-cols-4 p-4 font-medium border-b">
                                    <div>Provider</div>
                                    <div>Total Cost</div>
                                    <div>Installation Time</div>
                                    <div>Warranty</div>
                                  </div>
                                  {quotes.map((quote) => {
                                    const quoteProvider = providers.find(p => p.id === quote.providerId);
                                    return (
                                      <div key={quote.id} className="grid grid-cols-1 md:grid-cols-4 p-4 border-b last:border-0 items-center gap-4 md:gap-0">
                                        <div className="font-medium">{quoteProvider?.name || "Unknown Provider"}</div>
                                        <div>${quote.totalCost.toLocaleString()}</div>
                                        <div>{quote.installationTimeWeeks} weeks</div>
                                        <div>{quote.warrantyYears} years</div>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {!votingOpen && (
                                  <div className="flex justify-end mt-4">
                                    <Button onClick={startVoting}>
                                      Start Community Voting
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Voting Tab */}
                  <TabsContent value="voting">
                    <Card>
                      <CardHeader>
                        <CardTitle>Provider Voting</CardTitle>
                        <CardDescription>
                          Vote for your preferred solar provider for the community installation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {votingComplete ? (
                          <div className="space-y-6">
                            <div className="p-6 border rounded-lg bg-green-50 border-green-200 text-center">
                              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                              <h3 className="text-xl font-semibold mb-2">Voting Complete</h3>
                              <p className="text-muted-foreground mb-4">
                                The community has selected a provider for the solar installation.
                              </p>
                              <div className="bg-white p-4 rounded-md border max-w-md mx-auto">
                                <h4 className="font-semibold text-lg">{winningProvider?.name || "Selected Provider"}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{winningProvider?.location || ""}</p>
                                <dl className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                  <div>
                                    <dt className="text-muted-foreground">Total Cost:</dt>
                                    <dd className="font-medium">${winningQuote?.totalCost.toLocaleString() || "N/A"}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-muted-foreground">Installation Time:</dt>
                                    <dd className="font-medium">{winningQuote?.installationTimeWeeks || "N/A"} weeks</dd>
                                  </div>
                                  <div>
                                    <dt className="text-muted-foreground">Warranty:</dt>
                                    <dd className="font-medium">{winningQuote?.warrantyYears || "N/A"} years</dd>
                                  </div>
                                  <div>
                                    <dt className="text-muted-foreground">Votes Received:</dt>
                                    <dd className="font-medium">{votingResults.results?.[votingResults.winner] || 0} votes</dd>
                                  </div>
                                </dl>
                              </div>
                              <Button onClick={() => setActiveTab('payment')} className="mt-6">
                                Proceed to Payment
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                              <div className="flex">
                                <Timer className="h-5 w-5 mr-2 text-yellow-500" />
                                <p>
                                  Voting is currently open. Each community member can vote for one provider. 
                                  The provider with the most votes will be selected for the installation.
                                </p>
                              </div>
                            </div>
                            
                            <RadioGroup className="space-y-4">
                              {quotes.map((quote) => {
                                const quoteProvider = providers.find(p => p.id === quote.providerId);
                                const voteCount = votingResults.results?.[quote.providerId] || 0;
                                return (
                                  <div key={quote.id} className="flex items-start space-x-2">
                                    <RadioGroupItem 
                                      value={quote.providerId.toString()} 
                                      id={`provider-${quote.providerId}`}
                                      onClick={() => setSelectedProvider(quote.providerId)}
                                    />
                                    <Label htmlFor={`provider-${quote.providerId}`} className="flex-1 cursor-pointer">
                                      <Card className="p-4 hover:bg-accent/50">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                          <div>
                                            <h4 className="font-medium">{quoteProvider?.name || "Unknown Provider"}</h4>
                                            <p className="text-sm text-muted-foreground">{quoteProvider?.location || ""}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">Total Cost</p>
                                            <p className="font-medium">${quote.totalCost.toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">Installation Time</p>
                                            <p className="font-medium">{quote.installationTimeWeeks} weeks</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">Current Votes</p>
                                            <p className="font-medium">{voteCount} vote{voteCount !== 1 && 's'}</p>
                                          </div>
                                        </div>
                                      </Card>
                                    </Label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                            
                            <div className="flex justify-end mt-4">
                              <Button 
                                onClick={() => selectedProvider && submitVote(selectedProvider)}
                                disabled={!selectedProvider || loading.voting}
                              >
                                {loading.voting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Vote
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Payment Tab */}
                  <TabsContent value="payment">
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Solar Installation Payment</CardTitle>
                        <CardDescription>
                          Pay your portion of the community solar installation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {votingComplete ? (
                          <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Selected Provider</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-lg">{winningProvider?.name || "Selected Provider"}</h4>
                                      <p className="text-sm text-muted-foreground">{winningProvider?.location || ""}</p>
                                    </div>
                                    <dl className="grid grid-cols-2 gap-4">
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Total Cost</dt>
                                        <dd>${winningQuote?.totalCost.toLocaleString() || "N/A"}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Installation Time</dt>
                                        <dd>{winningQuote?.installationTimeWeeks || "N/A"} weeks</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Warranty</dt>
                                        <dd>{winningQuote?.warrantyYears || "N/A"} years</dd>
                                      </div>
                                    </dl>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Your Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <dl className="space-y-3">
                                    <div className="flex justify-between py-1">
                                      <dt className="text-muted-foreground">Total Installation Cost:</dt>
                                      <dd className="font-medium">${winningQuote?.totalCost.toLocaleString() || "0"}</dd>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <dt className="text-muted-foreground">Community Members:</dt>
                                      <dd className="font-medium">{communityMembers.length}</dd>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <dt className="text-muted-foreground">Your Monthly Usage:</dt>
                                      <dd className="font-medium">{userMonthlyAverage.toFixed(2)} kWh</dd>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <dt className="text-muted-foreground">Total Community Usage:</dt>
                                      <dd className="font-medium">{averageMonthlyUsage.toFixed(2)} kWh</dd>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <dt className="text-muted-foreground">Your Usage Percentage:</dt>
                                      <dd className="font-medium">
                                        {averageMonthlyUsage ? ((userMonthlyAverage / averageMonthlyUsage) * 100).toFixed(1) : 0}%
                                      </dd>
                                    </div>
                                    <div className="border-t my-2"></div>
                                    <div className="flex justify-between pt-2 text-lg">
                                      <dt className="font-semibold">Your Share:</dt>
                                      <dd className="font-bold">${userShareAmount.toLocaleString()}</dd>
                                    </div>
                                  </dl>
                                  
                                  <Button 
                                    onClick={() => setPaymentOpen(true)}
                                    className="w-full mt-6"
                                  >
                                    Make Payment
                                  </Button>
                                  
                                  <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Payment Options</DialogTitle>
                                        <DialogDescription>
                                          Choose your preferred payment method
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4 py-4">
                                        <RadioGroup defaultValue="upi" className="space-y-4">
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="upi" id="upi" />
