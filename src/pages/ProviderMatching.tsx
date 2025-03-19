
import React from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, CheckCircle2, CalendarClock, ClipboardList, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProviderMatching = () => {
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
          <Tabs defaultValue="find-installers" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="find-installers">Find Installers</TabsTrigger>
              <TabsTrigger value="community-decision">Community Decision</TabsTrigger>
              <TabsTrigger value="installation-tracking">Installation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="find-installers" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "SolarBright Solutions",
                    rating: 4.9,
                    reviews: 128,
                    certified: true,
                    yearsExperience: 12,
                    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2564&q=80"
                  },
                  {
                    name: "GreenPower Installations",
                    rating: 4.7,
                    reviews: 95,
                    certified: true,
                    yearsExperience: 8,
                    image: "https://images.unsplash.com/photo-1525617874235-2f0ce6e0c949?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
                  },
                  {
                    name: "SunTech Providers",
                    rating: 4.8,
                    reviews: 156,
                    certified: true,
                    yearsExperience: 15,
                    image: "https://images.unsplash.com/photo-1642543348745-32cf3e1e7e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80"
                  }
                ].map((provider, index) => (
                  <Card key={index} className="shadow-soft overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={provider.image} 
                        alt={provider.name} 
                        className="w-full h-full object-cover" 
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
                      <Button variant="outline" size="sm" className="button-animation">
                        <MessageSquare className="h-4 w-4 mr-2" /> Contact
                      </Button>
                      <Link to="/payment">
                        <Button size="sm" className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                          Request Quote
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="community-decision" className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-soft mb-8">
                  <CardHeader>
                    <CardTitle>Community Voting</CardTitle>
                    <CardDescription>
                      Vote on which solar provider your community should choose for the installation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          name: "SolarBright Solutions",
                          votes: 68,
                          totalCost: "$24,850",
                          timeframe: "4-6 weeks",
                          quotedDate: "May 15, 2023"
                        },
                        {
                          name: "GreenPower Installations",
                          votes: 42,
                          totalCost: "$26,320",
                          timeframe: "3-5 weeks",
                          quotedDate: "May 18, 2023"
                        },
                        {
                          name: "SunTech Providers",
                          votes: 53,
                          totalCost: "$25,100",
                          timeframe: "5-7 weeks",
                          quotedDate: "May 14, 2023"
                        }
                      ].map((provider, index) => (
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
                            <Button variant="outline" className="button-animation">
                              Cast Vote
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Voting ends in: 3 days, 8 hours</p>
                    <Button className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                      View Detailed Comparison
                    </Button>
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
                    <Link to="/monitoring" className="w-full">
                      <Button className="w-full button-animation">
                        Proceed to Installation Planning
                      </Button>
                    </Link>
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

const DollarSign = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default ProviderMatching;
