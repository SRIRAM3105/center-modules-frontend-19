
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, CheckCircle2, CalendarClock, ClipboardList, Star, MessageSquare, DollarSign, ThumbsUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { providerAPI } from '@/services/api';
import { Progress } from '@/components/ui/progress';

const ProviderMatching = () => {
  const { toast } = useToast();
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentTab, setCurrentTab] = useState("find-installers");
  const [votingEnded, setVotingEnded] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<any[]>([]);
  const [providerQuotes, setProviderQuotes] = useState<any[]>([]);
  const [communitySize, setCommunitySize] = useState(25); // Mock community size

  useEffect(() => {
    // Check if there are any saved selected providers
    const savedProviders = localStorage.getItem('selectedProviders');
    if (savedProviders) {
      setSelectedProviders(JSON.parse(savedProviders));
    }

    // Mock provider quotes
    const mockQuotes = [
      {
        id: "sb-001",
        name: "SolarBright Solutions",
        totalCost: 549800,
        perMemberCost: 549800 / communitySize,
        timeframe: "4-6 weeks",
        quotedDate: "October 15, 2023",
        votes: 14
      },
      {
        id: "gp-002",
        name: "GreenPower Installations",
        totalCost: 512500,
        perMemberCost: 512500 / communitySize,
        timeframe: "5-7 weeks",
        quotedDate: "October 18, 2023",
        votes: 8
      },
      {
        id: "st-003",
        name: "SunTech Providers",
        totalCost: 580200,
        perMemberCost: 580200 / communitySize,
        timeframe: "3-5 weeks",
        quotedDate: "October 17, 2023",
        votes: 3
      }
    ];
    
    setProviderQuotes(mockQuotes);
    
    // In a real app, we would fetch from API
    // async function fetchQuotes() {
    //   const response = await providerAPI.getProviderQuotes();
    //   if (!response.error) {
    //     setProviderQuotes(response);
    //   }
    // }
    // fetchQuotes();
  }, [communitySize]);

  const providers = [
    {
      id: "sb-001",
      name: "SolarBright Solutions",
      rating: 4.9,
      reviews: 128,
      certified: true,
      yearsExperience: 12,
      image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2564&q=80"
    },
    {
      id: "gp-002",
      name: "GreenPower Installations",
      rating: 4.7,
      reviews: 95,
      certified: true,
      yearsExperience: 8,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
    },
    {
      id: "st-003",
      name: "SunTech Providers",
      rating: 4.8,
      reviews: 156,
      certified: true,
      yearsExperience: 15,
      image: "https://images.unsplash.com/photo-1611265017502-4de827c3a870?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the provider
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

  const handleRequestQuote = (providerId: string) => {
    // Find the provider
    const provider = providers.find(p => p.id === providerId);
    
    // Check if the provider is already selected
    if (selectedProviders.some(p => p.id === providerId)) {
      toast({
        title: "Already Requested",
        description: `You've already requested a quote from ${provider?.name}.`,
      });
      return;
    }
    
    // Add to selected providers
    if (provider) {
      const updatedProviders = [...selectedProviders, provider];
      setSelectedProviders(updatedProviders);
      localStorage.setItem('selectedProviders', JSON.stringify(updatedProviders));
      
      toast({
        title: "Quote Requested",
        description: `Your quote has been requested from ${provider.name}. They will review and respond shortly.`,
      });
      
      // In a real app, we would call the API
      // providerAPI.requestQuote(providerId, { communityId: currentCommunity.id })
      //   .then(response => {
      //     if (!response.error) {
      //       // Handle success
      //     }
      //   });
      
      // Change tab to community-decision if this is the first provider
      if (selectedProviders.length === 0) {
        setCurrentTab("community-decision");
      }
    }
  };

  const handleVote = (providerId: string) => {
    // Update votes in the provider quotes
    const updatedQuotes = providerQuotes.map(quote => 
      quote.id === providerId 
        ? { ...quote, votes: quote.votes + 1 } 
        : quote
    );
    
    setProviderQuotes(updatedQuotes);
    
    toast({
      title: "Vote Recorded",
      description: "Your vote has been recorded. Thank you for participating!",
    });
    
    // In a real app, we would call the API
    // providerAPI.submitVote(providerId)
    //   .then(response => {
    //     if (!response.error) {
    //       // Handle success
    //     }
    //   });
  };
  
  const endVoting = () => {
    setVotingEnded(true);
    
    // Find the provider with the most votes
    const winningProvider = [...providerQuotes].sort((a, b) => b.votes - a.votes)[0];
    
    toast({
      title: "Voting Ended",
      description: `${winningProvider.name} has been selected as your community's solar provider.`,
    });
    
    // In a real app, we would call the API to notify the winning provider
    // providerAPI.selectWinningProvider(winningProvider.id)
    //   .then(response => {
    //     if (!response.error) {
    //       // Handle success
    //     }
    //   });
    
    // Automatically move to installation tracking
    setTimeout(() => {
      setCurrentTab("installation-tracking");
    }, 2000);
  };

  const calculateTotalVotes = () => {
    return providerQuotes.reduce((total, provider) => total + provider.votes, 0);
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider, index) => (
                  <Card key={index} className="shadow-soft overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={provider.image} 
                        alt={provider.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
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
                      >
                        {selectedProviders.some(p => p.id === provider.id) 
                          ? <CheckCircle2 className="h-4 w-4 mr-2" /> 
                          : null
                        }
                        {selectedProviders.some(p => p.id === provider.id) 
                          ? "Quote Requested" 
                          : "Request Quote"
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {selectedProviders.length > 0 && (
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    onClick={() => setCurrentTab("community-decision")}
                  >
                    View Provider Quotes & Voting
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="community-decision" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                {selectedProviders.length === 0 ? (
                  <Card className="shadow-soft mb-8">
                    <CardContent className="py-16 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium">No Providers Selected</h3>
                      <p className="text-muted-foreground mt-2">
                        You need to request quotes from providers first.
                      </p>
                      <Button 
                        onClick={() => setCurrentTab("find-installers")} 
                        className="mt-4"
                      >
                        Find Providers
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className="shadow-soft mb-8">
                      <CardHeader>
                        <CardTitle>Provider Quotes & Community Voting</CardTitle>
                        <CardDescription>
                          Review quotes from solar providers and vote on which provider your community should choose.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {providerQuotes.map((provider, index) => (
                            <div key={index} className="p-4 rounded-lg border border-border bg-white flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="mb-4 md:mb-0">
                                <h3 className="font-medium text-lg">{provider.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" /> Total: ₹{provider.totalCost.toLocaleString()}
                                  </span>
                                  <span className="flex items-center font-medium text-foreground">
                                    Your cost: ₹{Math.round(provider.perMemberCost).toLocaleString()}
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
                                  variant={votingEnded ? "ghost" : "outline"}
                                  className="button-animation"
                                  onClick={() => handleVote(provider.id)}
                                  disabled={votingEnded}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" /> Cast Vote
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Voting results visualization */}
                        {calculateTotalVotes() > 0 && (
                          <div className="mt-8 p-4 rounded-lg border border-border bg-white">
                            <h3 className="font-medium mb-4">Voting Results</h3>
                            <div className="space-y-4">
                              {providerQuotes.map((provider, index) => {
                                const percentage = Math.round((provider.votes / calculateTotalVotes()) * 100) || 0;
                                return (
                                  <div key={index}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium">{provider.name}</span>
                                      <span className="text-sm font-medium">{percentage}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                          {votingEnded 
                            ? "Voting has ended. The selected provider has been notified."
                            : "Cast your vote to help select the best provider for your community."
                          }
                        </p>
                        {!votingEnded && calculateTotalVotes() > 5 && (
                          <Button 
                            onClick={endVoting}
                            className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          >
                            End Voting & Select Provider
                          </Button>
                        )}
                        {votingEnded && (
                          <Button
                            onClick={() => setCurrentTab("installation-tracking")}
                            className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          >
                            View Installation Progress
                          </Button>
                        )}
                      </CardFooter>
                    </Card>

                    <Card className="shadow-soft">
                      <CardHeader>
                        <CardTitle>Final Selection</CardTitle>
                        <CardDescription>
                          After voting is complete, the community will finalize the selection.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            The final selection process considers:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <span>Community vote results</span>
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
                      </CardContent>
                      <CardFooter>
                        <Link to="/payment" className="w-full">
                          <Button className="w-full button-animation" disabled={!votingEnded}>
                            Proceed to Payment
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </>
                )}
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
                    <Link to="/payment" className="w-full">
                      <Button variant="outline" className="w-full button-animation">
                        View All Updates
                      </Button>
                    </Link>
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
