
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Loader2, UserPlus, Share2, KeyRound, Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { communityAPI } from '@/services/api';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const joinCommunitySchema = z.object({
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code" })
});

const createCommunitySchema = z.object({
  name: z.string().min(2, { message: "Community name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Please provide a brief description" }),
  location: z.string().min(2, { message: "Please enter a valid location" }),
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code" })
});

const joinByCodeSchema = z.object({
  inviteCode: z.string().min(6, { message: "Invite code must be at least 6 characters" })
});

const Community = () => {
  const [activeTab, setActiveTab] = useState('join');
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState({
    join: false,
    create: false,
    submitJoin: false,
    joinByCode: false
  });
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [inviteCodeDialogOpen, setInviteCodeDialogOpen] = useState(false);
  const [communityInviteCode, setCommunityInviteCode] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/registration');
    }
  }, [isAuthenticated, navigate]);

  const joinForm = useForm<z.infer<typeof joinCommunitySchema>>({
    resolver: zodResolver(joinCommunitySchema),
    defaultValues: {
      zipCode: ""
    }
  });

  const createForm = useForm<z.infer<typeof createCommunitySchema>>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      zipCode: ""
    }
  });

  const joinByCodeForm = useForm<z.infer<typeof joinByCodeSchema>>({
    resolver: zodResolver(joinByCodeSchema),
    defaultValues: {
      inviteCode: ""
    }
  });

  const onSearchCommunities = async (data: z.infer<typeof joinCommunitySchema>) => {
    setIsLoading(prev => ({ ...prev, join: true }));
    try {
      const communitiesData = await communityAPI.browseCommunities({ zipCode: data.zipCode });
      
      if (communitiesData.error) {
        toast({
          title: "Search failed",
          description: communitiesData.message || "Could not find communities. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, join: false }));
        return;
      }
      
      setCommunities(communitiesData);
      
      if (communitiesData.length === 0) {
        toast({
          title: "No communities found",
          description: "No communities found in your area. Would you like to create one?",
          variant: "default",
        });
      } else {
        toast({
          title: "Communities found!",
          description: `${communitiesData.length} communities found in your area.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Browse communities error:", error);
      toast({
        title: "Search failed",
        description: "Could not load communities. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, join: false }));
    }
  };

  const onCreateCommunity = async (data: z.infer<typeof createCommunitySchema>) => {
    setIsLoading(prev => ({ ...prev, create: true }));
    try {
      const response = await communityAPI.createCommunity(data);
      
      if (response.error) {
        toast({
          title: "Creation failed",
          description: response.message || "There was an error creating your community. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, create: false }));
        return;
      }
      
      toast({
        title: "Community created!",
        description: "Your community has been successfully created. You can now invite others to join.",
        variant: "default",
      });
      
      // Generate an invite code for the community
      setCommunityInviteCode(response.inviteCode || generateRandomInviteCode());
      setInviteCodeDialogOpen(true);
      
      // Reset the form
      createForm.reset();
      
      // Navigate to data collection after creating community
      setTimeout(() => {
        navigate('/data-collection');
      }, 5000);
    } catch (error) {
      console.error("Create community error:", error);
      toast({
        title: "Creation failed",
        description: "There was an error creating your community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, create: false }));
    }
  };

  const onJoinCommunity = async () => {
    if (!selectedCommunity) {
      toast({
        title: "Selection required",
        description: "Please select a community to join.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(prev => ({ ...prev, submitJoin: true }));
    try {
      const response = await communityAPI.joinCommunity(selectedCommunity.id);
      
      if (response.error) {
        toast({
          title: "Joining failed",
          description: response.message || "There was an error joining the community. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, submitJoin: false }));
        return;
      }
      
      toast({
        title: "Successfully joined!",
        description: `You have joined ${selectedCommunity.name}. Welcome to the community!`,
        variant: "default",
      });
      
      // Navigate to data collection after joining
      setTimeout(() => {
        navigate('/data-collection');
      }, 2000);
    } catch (error) {
      console.error("Join community error:", error);
      toast({
        title: "Joining failed",
        description: "There was an error joining the community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, submitJoin: false }));
    }
  };

  const onJoinByCode = async (data: z.infer<typeof joinByCodeSchema>) => {
    setIsLoading(prev => ({ ...prev, joinByCode: true }));
    try {
      const response = await communityAPI.joinCommunityByCode(data.inviteCode);
      
      if (response.error) {
        toast({
          title: "Joining failed",
          description: response.message || "Invalid invite code. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, joinByCode: false }));
        return;
      }
      
      toast({
        title: "Successfully joined!",
        description: `You have joined ${response.community.name}. Welcome to the community!`,
        variant: "default",
      });
      
      setJoinByCodeOpen(false);
      
      // Navigate to data collection after joining
      setTimeout(() => {
        navigate('/data-collection');
      }, 2000);
    } catch (error) {
      console.error("Join by code error:", error);
      toast({
        title: "Joining failed",
        description: "There was an error joining the community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, joinByCode: false }));
    }
  };

  // Generate a random invite code for demonstration
  const generateRandomInviteCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Join the Solar Community
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with neighbors to share solar benefits, reduce costs, and maximize your impact.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Community</TabsTrigger>
              <TabsTrigger value="create">Create Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="join">
              <Card>
                <CardHeader>
                  <CardTitle>Find Communities Near You</CardTitle>
                  <CardDescription>
                    Enter your ZIP code to discover solar communities in your area
                  </CardDescription>
                </CardHeader>
                
                <Form {...joinForm}>
                  <form onSubmit={joinForm.handleSubmit(onSearchCommunities)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={joinForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input placeholder="Enter your ZIP code" className="pl-10" {...field} />
                              </FormControl>
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Have an invite code?
                        </p>
                        <Dialog open={joinByCodeOpen} onOpenChange={setJoinByCodeOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <KeyRound className="h-4 w-4" />
                              Join with Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Join with Invite Code</DialogTitle>
                              <DialogDescription>
                                Enter the community invite code you received
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...joinByCodeForm}>
                              <form onSubmit={joinByCodeForm.handleSubmit(onJoinByCode)} className="space-y-4">
                                <FormField
                                  control={joinByCodeForm.control}
                                  name="inviteCode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Invite Code</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter invite code" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                                    disabled={isLoading.joinByCode}
                                  >
                                    {isLoading.joinByCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Join Community
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                        disabled={isLoading.join}
                      >
                        {isLoading.join && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Search className="h-4 w-4 mr-2" />
                        Find Communities
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              {communities.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-medium">Available Communities ({communities.length})</h3>
                  <div className="space-y-4">
                    {communities.map((community) => (
                      <Card 
                        key={community.id} 
                        className={`cursor-pointer transition-all ${selectedCommunity?.id === community.id ? 'ring-2 ring-primary' : 'hover:bg-muted/30'}`}
                        onClick={() => setSelectedCommunity(community)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-semibold">{community.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                <MapPin className="h-3.5 w-3.5 inline mr-1" />
                                {community.location}
                              </p>
                              <p className="text-sm">{community.description}</p>
                            </div>
                            <div className="flex items-center space-x-1 bg-muted/60 px-2 py-1 rounded-full">
                              <Users className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium">{community.memberCount}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={onJoinCommunity}
                    className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    disabled={isLoading.submitJoin || !selectedCommunity}
                  >
                    {isLoading.submitJoin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Selected Community
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Community</CardTitle>
                  <CardDescription>
                    Start your own solar community and invite others to join
                  </CardDescription>
                </CardHeader>
                
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateCommunity)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Community Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a name for your community" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your community and its goals"
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={createForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter ZIP code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Alert className="bg-muted/60 border-muted">
                        <AlertTitle className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Community Creator Benefits</span>
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          As the creator, you'll be assigned the admin role for the community. This gives you the ability to manage members, adjust energy allocations, and make key decisions.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                        disabled={isLoading.create}
                      >
                        {isLoading.create && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Invite Code Dialog */}
          <Dialog open={inviteCodeDialogOpen} onOpenChange={setInviteCodeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Community Created Successfully!</DialogTitle>
                <DialogDescription>
                  Share this invite code with others to join your community.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 bg-muted rounded-md text-center">
                <p className="text-sm mb-2">Your unique community invite code:</p>
                <div className="text-xl font-mono font-bold tracking-wider text-primary py-2">
                  {communityInviteCode}
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-col gap-2">
                <Button 
                  className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                  onClick={() => {
                    navigator.clipboard.writeText(communityInviteCode);
                    toast({
                      title: "Copied to clipboard",
                      description: "The invite code has been copied to your clipboard."
                    });
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Invite Code
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setInviteCodeDialogOpen(false);
                    navigate('/data-collection');
                  }}
                >
                  Continue to Data Collection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Section>
    </div>
  );
};

export default Community;
