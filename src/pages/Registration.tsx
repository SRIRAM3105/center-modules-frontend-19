
import React, { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Users, Loader2, Building2, MapPin, CheckCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authAPI, communityAPI, providerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Define schemas for form validation
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  isProvider: z.boolean().default(false)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Please enter your password" })
});

const browseCommunitySchema = z.object({
  location: z.string().min(1, { message: "Please enter a location" })
});

const createCommunitySchema = z.object({
  name: z.string().min(2, { message: "Community name must be at least 2 characters" })
});

const providerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  contact: z.string().min(10, { message: "Please enter a valid contact number" }),
  location: z.string().min(2, { message: "Please enter a valid location" }),
  upi_id: z.string().min(4, { message: "Please enter a valid UPI ID" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const Registration = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [isLoading, setIsLoading] = useState({
    signup: false,
    login: false,
    browse: false,
    create: false,
    provider: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form setup
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isProvider: false
    }
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const browseCommunityForm = useForm<z.infer<typeof browseCommunitySchema>>({
    resolver: zodResolver(browseCommunitySchema),
    defaultValues: {
      location: ""
    }
  });

  const createCommunityForm = useForm<z.infer<typeof createCommunitySchema>>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: ""
    }
  });

  const providerForm = useForm<z.infer<typeof providerSchema>>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact: "",
      location: "",
      upi_id: ""
    }
  });

  // Watch for isProvider value changes
  const isProvider = signupForm.watch("isProvider");

  // Form submission handlers
  const onSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (data.isProvider) {
      setActiveTab('provider');
      return;
    }
    
    setIsLoading(prev => ({ ...prev, signup: true }));
    try {
      const { confirmPassword, isProvider, ...signupData } = data;
      await authAPI.signup(signupData);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
        variant: "default",
      });
      navigate('/data-collection');
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, signup: false }));
    }
  };

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(prev => ({ ...prev, login: true }));
    try {
      await authAPI.login(data);
      toast({
        title: "Login successful!",
        description: "You have been logged in successfully.",
        variant: "default",
      });
      navigate('/data-collection');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  };

  const onProviderSubmit = async (data: z.infer<typeof providerSchema>) => {
    setIsLoading(prev => ({ ...prev, provider: true }));
    try {
      const { confirmPassword, ...providerData } = data;
      await providerAPI.registerProvider(providerData);
      toast({
        title: "Provider registration successful!",
        description: "Your provider account has been created. You will be notified once your certification is complete.",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error("Provider registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error registering your provider account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, provider: false }));
    }
  };

  const onBrowseCommunitySubmit = async (data: z.infer<typeof browseCommunitySchema>) => {
    setIsLoading(prev => ({ ...prev, browse: true }));
    try {
      const communities = await communityAPI.browseCommunities(data.location);
      toast({
        title: "Communities found!",
        description: `${communities.length} communities found in your area.`,
        variant: "default",
      });
      // Here you could update state to show the results or navigate to a results page
    } catch (error) {
      console.error("Browse communities error:", error);
      toast({
        title: "Search failed",
        description: "Could not load communities. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, browse: false }));
    }
  };

  const onCreateCommunitySubmit = async (data: z.infer<typeof createCommunitySchema>) => {
    setIsLoading(prev => ({ ...prev, create: true }));
    try {
      await communityAPI.createCommunity(data);
      toast({
        title: "Community created!",
        description: "Your community has been successfully created.",
        variant: "default",
      });
      // Here you could navigate to the new community page
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

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-right">
            <div className="inline-flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <UserPlus className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-primary">User Registration & Community</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Join the Solar Revolution Today
            </h1>
            <p className="text-xl text-muted-foreground">
              Create an account to join existing solar communities or start your own. Together, we can make renewable energy more accessible and affordable.
            </p>
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Sign-Up</h3>
                  <p className="text-sm text-muted-foreground">Create your account in minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Find Your Community</h3>
                  <p className="text-sm text-muted-foreground">Join or create local solar groups</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto animate-slide-in-left">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="provider">Provider</TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your information to get started with your solar journey.
                    </CardDescription>
                  </CardHeader>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={signupForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Full Name</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="John Doe" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="john@example.com" 
                                    type="email" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Confirm Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="isProvider"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I am a solar provider
                                </FormLabel>
                                <FormDescription>
                                  Check this if you want to register as a solar installation provider
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading.signup}
                        >
                          {isLoading.signup && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isProvider ? "Continue as Provider" : "Create Account"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
              <TabsContent value="login">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                      Login to your account to continue your solar journey.
                    </CardDescription>
                  </CardHeader>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="john@example.com" 
                                    type="email" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <a href="#" className="text-sm text-primary hover:underline">
                                  Forgot password?
                                </a>
                              </div>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading.login}
                        >
                          {isLoading.login && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Login
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
              <TabsContent value="provider">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Provider Registration</CardTitle>
                    <CardDescription>
                      Register as a solar installation provider to offer your services.
                    </CardDescription>
                  </CardHeader>
                  <Form {...providerForm}>
                    <form onSubmit={providerForm.handleSubmit(onProviderSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={providerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Company/Provider Name</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="Solar Solutions Inc." 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="contact@solarsolutions.com" 
                                    type="email" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Confirm Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Contact Number</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="+91 9876543210" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Location/Service Area</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="Mumbai, Maharashtra" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="upi_id"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>UPI ID</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="business@upi" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">
                              After registration, our team will review your information for certification. 
                              You'll be notified once your provider account is certified.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading.provider}
                        >
                          {isLoading.provider && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Register as Provider
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="section-title">Join a Community or Create Your Own</h2>
          <p className="section-subtitle">
            Connect with neighbors and friends to form solar communities, share costs, and maximize your impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-soft animate-scale-in [animation-delay:100ms]">
            <CardHeader>
              <CardTitle>Join an Existing Community</CardTitle>
              <CardDescription>
                Find and join solar communities in your area that are already established.
              </CardDescription>
            </CardHeader>
            <Form {...browseCommunityForm}>
              <form onSubmit={browseCommunityForm.handleSubmit(onBrowseCommunitySubmit)}>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80" 
                      alt="Community meeting" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium">20+ Communities Available</div>
                  </div>
                  <FormField
                    control={browseCommunityForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Search by Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your city or ZIP code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    variant="outline" 
                    className="w-full button-animation"
                    disabled={isLoading.browse}
                  >
                    {isLoading.browse && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Browse Communities
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="shadow-soft animate-scale-in [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Create a New Community</CardTitle>
              <CardDescription>
                Start your own solar community and invite neighbors to join your initiative.
              </CardDescription>
            </CardHeader>
            <Form {...createCommunityForm}>
              <form onSubmit={createCommunityForm.handleSubmit(onCreateCommunitySubmit)}>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80" 
                      alt="People starting a community" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium">Create in Minutes</div>
                  </div>
                  <FormField
                    control={createCommunityForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Community Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a name for your community"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    disabled={isLoading.create}
                  >
                    {isLoading.create && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Community
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

export default Registration;
