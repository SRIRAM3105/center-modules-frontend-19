import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, CheckCircle2, CalendarClock, ClipboardList, Star, MessageSquare, DollarSign, ThumbsUp, AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { providerAPI } from '@/services/api';

const ProviderMatching = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<any[]>([]);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentTab, setCurrentTab] = useState("find-installers");
  const [loading, setLoading] = useState(false);
  const [votedProvider, setVotedProvider] = useState('');
  const [majorityProvider, setMajorityProvider] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const mockProviders = [
          {
            id: "sb-001",
            name: "SolarBright Solutions",
            rating: 4.9,
            reviews: 128,
            certified: true,
            yearsExperience: 12,
            image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2564&q=80",
            votes: 68,
            totalCost: "₹24,850",
            timeframe: "4-6 weeks",
            quotedDate: "May 15, 2023"
          },
          {
            id: "gp-002",
            name: "GreenPower Installations",
            rating: 4.7,
            reviews: 95,
            certified: true,
            yearsExperience: 8,
            image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80",
            votes: 42,
            totalCost: "₹26,320",
            timeframe: "3-5 weeks",
            quotedDate: "May 18, 2023"
          },
          {
            id: "st-003",
            name: "SunTech Providers",
            rating: 4.8,
            reviews: 156,
            certified: true,
            yearsExperience: 15,
            image: "https://images.unsplash.com/photo-1611365892117-bdf9aede0cd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80",
            votes: 53,
            totalCost: "₹25,100",
            timeframe: "5-7 weeks",
            quotedDate: "May 14, 2023"
          }
        ];
        
        try {
          const data = await providerAPI.getProviders();
          if (data && data.length > 0) {
            setProviders(data);
          } else {
            setProviders(mockProviders);
          }
        } catch (error) {
          console.error('Error fetching providers from API:', error);
          setProviders(mockProviders);
          toast({
            title: "API Connection Issue",
            description: "Using sample provider data for demonstration",
          });
        }
      } catch (error) {
        console.error('Error in fetchProviders:', error);
        toast({
          title: "Error",
          description: "Failed to load solar providers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${activeProvider}. They will contact you shortly.`,
    });
    
    setTimeout(() => {
      setContactFormOpen(false);
      setFormSubmitted(false);
    }, 2000);
  };

  const handleRequestQuote = async (providerId: string) => {
    try {
      setLoading(true);
      
      try {
        await providerAPI.selectProvider(providerId);
      } catch (error) {
        console.error('Error selecting provider:', error);
      }
      
      const selectedProvider = providers.find(p => p.id === providerId);
      localStorage.setItem('selectedProviders', JSON.stringify([selectedProvider]));
      
      setCurrentTab("community-decision");
      
      toast({
        title: "Quote Requested",
        description: `Your quote has been requested from ${selectedProvider.name}. You can now vote in the community decision.`,
      });
    } catch (error) {
      console.error('Error requesting quote:', error);
      toast({
        title: "Error",
        description: "Failed to request quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (providerId: string) => {
    try {
      setLoading(true);
      
      try {
        await providerAPI.voteForProvider(providerId);
      } catch (error) {
        console.error('Error voting via API:', error);
      }
      
      setVotedProvider(providerId);
      
      setProviders(providers.map(provider => {
        if (provider.id === providerId) {
          return { ...provider, votes: provider.votes + 1 };
        }
        return provider;
      }));
      
      toast({
        title: "Vote Recorded",
        description: "Your vote has been recorded. Thank you for participating in the community decision!",
      });
      
      checkMajorityVote();
    } catch (error) {
      console.error('Error voting for provider:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkMajorityVote = async () => {
    try {
      let majorityData = null;
      try {
        majorityData = await providerAPI.getMajorityVotedProvider();
      } catch (error) {
        console.error('Error fetching from API:', error);
      }
      
      if (majorityData && majorityData.providerId) {
        const majorityProvider = providers.find(p => p.id === majorityData.providerId);
        setMajorityProvider(majorityProvider);
        localStorage.setItem('majorityProvider', JSON.stringify(majorityProvider));
        return;
      }
      
      const voteCounts = providers.map(p => p.votes);
      const maxVotes = Math.max(...voteCounts);
      const winningProvider = providers.find(p => p.votes === maxVotes);
      
      if (winningProvider) {
        setMajorityProvider(winningProvider);
        localStorage.setItem('majorityProvider', JSON.stringify(winningProvider));
      }
    } catch (error) {
      console.error('Error checking majority vote:', error);
    }
  };

  const proceedToPayment = () => {
    navigate('/payment');
  };

  useEffect(() => {
    if (providers.length > 0 && votedProvider) {
      checkMajorityVote();
    }
  }, [providers, votedProvider]);

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="space-y-6 max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center space-x-2">
            <span className="rounded-full bg-primary/10 p-1">
              <Sun className="h-4 w-4 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Solar Provider Matching & Installation</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find the Perfect Solar Partner
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with certified solar providers, request quotes, and track your installation from start to finish.
          </p>
        </div>

        <div className="mt-16">
          <Tabs 
            defaultValue="find-installers" 
            className="w-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="find-installers">Find Installers</TabsTrigger>
              <TabsTrigger value="community-decision">Community Voting</TabsTrigger>
              <TabsTrigger value="installation-tracking">Installation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="find-installers" className="animate-fade-in">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading solar providers...</p>
                  </div>
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Providers Available</h3>
                  <p className="text-muted-foreground">No solar providers are currently available in your area.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers.map((provider, index) => (
                    <Card key={provider.id} className="shadow-soft overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={provider.image || "https://images.unsplash.com/photo-1611365892117-bdf9aede0cd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80"} 
                          alt={provider.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80";
                          }}
                        />
                        {provider.certified && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-primary text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Certified
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{provider.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <div className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-foreground font-medium">{provider.rating}</span>
                          </div>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span>{provider.reviews} reviews</span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span>{provider.yearsExperience} years</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Specializing in residential and community solar installations with excellent customer service and competitive pricing.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Dialog open={contactFormOpen && activeProvider === provider.name} onOpenChange={(open) => {
                          setContactFormOpen(open);
                          if (open) setActiveProvider(provider.name);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="button-animation">
                              <MessageSquare className="h-4 w-4 mr-2" /> Contact
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Contact {provider.name}</DialogTitle>
                              <DialogDescription>
                                Send a message to this provider to discuss your solar needs.
                              </DialogDescription>
                            </DialogHeader>
                            {!formSubmitted ? (
                              <form onSubmit={handleContactSubmit}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" className="col-span-3" required />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input id="email" type="email" className="col-span-3" required />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">Phone</Label>
                                    <Input id="phone" type="tel" className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="message" className="text-right">Message</Label>
                                    <Textarea id="message" className="col-span-3" required />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Send Message</Button>
                                </DialogFooter>
                              </form>
                            ) : (
                              <div className="py-6 text-center">
                                <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-4" />
                                <p className="text-lg font-medium">Message Sent!</p>
                                <p className="text-muted-foreground">The provider will contact you soon.</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          onClick={() => handleRequestQuote(provider.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Request Quote'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="community-decision" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-soft mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Community Voting
                    </CardTitle>
                    <CardDescription>
                      Vote on which solar provider your community should choose for the installation. The provider with the majority votes will be automatically selected.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {providers.map((provider, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-white flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-medium text-lg">{provider.name}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" /> {provider.totalCost}
                              </span>
                              <span className="flex items-center">
                                <CalendarClock className="h-4 w-4 mr-1" /> {provider.timeframe}
                              </span>
                              <span className="flex items-center">
                                <ClipboardList className="h-4 w-4 mr-1" /> Quoted: {provider.quotedDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-center">
                                <span className="text-2xl font-bold">{provider.votes}</span>
                                <p className="text-xs text-muted-foreground">Votes</p>
                              </div>
                            </div>
                            <Button 
                              variant={votedProvider === provider.id ? "default" : "outline"} 
                              className="button-animation"
                              onClick={() => handleVote(provider.id)}
                              disabled={loading || votedProvider === provider.id}
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" /> 
                              {votedProvider === provider.id ? 'Voted' : 'Cast Vote'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Voting ends in: 3 days, 8 hours</p>
                    <Button 
                      className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                      onClick={proceedToPayment}
                      disabled={loading}
                    >
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Final Selection</CardTitle>
                    <CardDescription>
                      After voting is complete, the community will finalize the selection based on majority votes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {majorityProvider ? (
                      <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-4">
                          <CheckCircle2 className="h-6 w-6 text-green-500 mr-3" />
                          <h3 className="text-lg font-medium">Majority Vote Determined</h3>
                        </div>
                        <p className="mb-4">
                          <strong>{majorityProvider.name}</strong> has received the majority of community votes and will be selected as your solar installation provider.
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-primary" />
                            <span>Total Cost: {majorityProvider.totalCost}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarClock className="h-4 w-4 mr-1 text-primary" />
                            <span>Timeframe: {majorityProvider.timeframe}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-primary" />
                            <span>Votes: {majorityProvider.votes}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          The final selection process considers:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>Community vote results (majority decision)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>Cost-benefit analysis</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>Provider certifications and experience</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>Timeline and availability</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full button-animation"
                      onClick={proceedToPayment}
                      disabled={loading}
                    >
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="installation-tracking" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-soft mb-8">
                  <CardHeader>
                    <CardTitle>Installation Schedule</CardTitle>
                    <CardDescription>
                      Track the timeline for your community solar installation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-8 border-l-2 border-primary/30 pb-1">
                      {[
                        { 
                          stage: "Initial Site Assessment",
                          date: "June 5, 2023",
                          status: "Completed",
                          description: "Professional evaluation of the installation site."
                        },
                        { 
                          stage: "Permitting & Approvals",
                          date: "June 15-30, 2023",
                          status: "In Progress",
                          description: "Obtaining necessary permits from local authorities."
                        },
                        { 
                          stage: "Equipment Delivery",
                          date: "July 10, 2023",
                          status: "Scheduled",
                          description: "Solar panels and equipment delivered to the site."
                        },
                        { 
                          stage: "Installation",
                          date: "July 15-25, 2023",
                          status: "Pending",
                          description: "Physical installation of the solar system."
                        },
                        { 
                          stage: "Inspection & Testing",
                          date: "August 1, 2023",
                          status: "Pending",
                          description: "Final inspection and system testing."
                        },
                        { 
                          stage: "Grid Connection",
                          date: "August 10, 2023",
                          status: "Pending",
                          description: "Connecting the system to the electrical grid."
                        }
                      ].map((stage, index) => (
                        <div key={index} className="mb-8 relative">
                          <div className="absolute -left-[36px] h-[18px] w-[18px] rounded-full bg-white border-2 border-primary"></div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{stage.stage}</h3>
                              <p className="text-sm text-muted-foreground">{stage.description}</p>
                              <p className="text-sm font-medium mt-1">{stage.date}</p>
                            </div>
                            <Badge 
                              className={
                                stage.status === "Completed" 
                                  ? "bg-eco-500" 
                                  : stage.status === "In Progress" 
                                  ? "bg-solar-500" 
                                  : "bg-muted"
                              }
                            >
                              {stage.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Progress Updates</CardTitle>
                    <CardDescription>
                      Stay informed with the latest updates on your installation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Permit Approval in Progress",
                          date: "June 18, 2023",
                          message: "The local building department is reviewing our permit application. Estimated approval in 7-10 days."
                        },
                        {
                          title: "Site Preparation Complete",
                          date: "June 12, 2023",
                          message: "The installation team has completed the necessary preparations for your solar installation."
                        },
                        {
                          title: "Initial Assessment Completed",
                          date: "June 5, 2023",
                          message: "Our team has completed the initial site assessment. The location is suitable for the planned 12kW system."
                        }
                      ].map((update, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{update.title}</h3>
                            <span className="text-xs text-muted-foreground">{update.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full button-animation">
                      View All Updates
                    </Button>
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

export default ProviderMatching;
