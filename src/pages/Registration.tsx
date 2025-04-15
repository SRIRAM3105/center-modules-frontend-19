import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Users, Loader2, Building2, MapPin, CheckCircle, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authAPI, communityAPI, providerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Password validation messages
const PASSWORD_REQUIREMENTS = [
  "At least 6 characters long",
  "Contains at least one uppercase letter",
  "Contains at least one lowercase letter",
  "Contains at least one number"
];

// Zod schema for password validation
const passwordSchema = z.string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: "Password must contain at least one uppercase letter" }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: "Password must contain at least one lowercase letter" }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    { message: "Password must contain at least one number" }
  );

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: passwordSchema,
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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" })
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
  password: passwordSchema,
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
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });
  const [isLoading, setIsLoading] = useState({
    signup: false,
    login: false,
    browse: false,
    create: false,
    provider: false,
    forgotPassword: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, resetPassword, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/data-collection');
    }
  }, [isAuthenticated, navigate]);

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

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
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

  const isProvider = signupForm.watch("isProvider");

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    });
  };

  // Watch the password field in the signup form
  const signupPassword = signupForm.watch("password");
  const providerPassword = providerForm.watch("password");

  // Update password strength whenever password changes
  useEffect(() => {
    if (signupPassword) {
      checkPasswordStrength(signupPassword);
    }
  }, [signupPassword]);

  // Update password strength for provider form
  useEffect(() => {
    if (providerPassword) {
      checkPasswordStrength(providerPassword);
    }
  }, [providerPassword]);

  const onSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (data.isProvider) {
      setActiveTab('provider');
      return;
    }
    
    setIsLoading(prev => ({ ...prev, signup: true }));
    try {
      const { confirmPassword, isProvider, ...signupData } = data;
      const response = await authAPI.signup(signupData);
      
      if (response.error) {
        toast({
          title: "Signup failed",
          description: response.message || "There was an error creating your account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, signup: false }));
        return;
      }
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
        variant: "default",
      });
      
      try {
        await login(data.email, data.password);
        navigate('/data-collection');
      } catch (loginError) {
        console.error("Auto-login error:", loginError);
        setActiveTab('login');
      }
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
      await login(data.email, data.password);
      // Successful login handled by AuthContext which already shows toast
      navigate('/data-collection');
    } catch (error: any) {
      // Error handling already done in AuthContext's login function
      console.error("Login error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  };

  const onForgotPasswordSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(prev => ({ ...prev, forgotPassword: true }));
    try {
      await resetPassword(data.email);
      // Toast notification handled in AuthContext
      setForgotPasswordOpen(false);
      forgotPasswordForm.reset();
    } catch (error) {
      // Error handling already done in AuthContext's resetPassword function
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, forgotPassword: false }));
    }
  };

  const onProviderSubmit = async (data: z.infer<typeof providerSchema>) => {
    setIsLoading(prev => ({ ...prev, provider: true }));
    try {
      const { confirmPassword, ...providerData } = data;
      const response = await providerAPI.registerProvider(providerData);
      
      if (response.error) {
        toast({
          title: "Provider registration failed",
          description: response.message || "There was an error registering your provider account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, provider: false }));
        return;
      }
      
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

  // Community-related functions - keeping them for future use
  const onBrowseCommunitySubmit = async (data: z.infer<typeof browseCommunitySchema>) => {
    setIsLoading(prev => ({ ...prev, browse: true }));
    try {
      const communities = await communityAPI.browseCommunities(data.location);
      toast({
        title: "Communities found!",
        description: `${communities.length} communities found in your area.`,
        variant: "default",
      });
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

  const renderPasswordStrengthIndicator = () => (
    <div className="mt-3 space-y-2 text-sm">
      <p className="font-medium text-muted-foreground">Password requirements:</p>
      <ul className="space-y-1">
        {PASSWORD_REQUIREMENTS.map((req, index) => {
          let isValid = false;
          switch (index) {
            case 0: isValid = passwordStrength.length; break;
            case 1: isValid = passwordStrength.uppercase; break;
            case 2: isValid = passwordStrength.lowercase; break;
            case 3: isValid = passwordStrength.number; break;
          }
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
                {req}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

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
                              {signupPassword && renderPasswordStrengthIndicator()}
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
                                <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                                  <DialogTrigger asChild>
                                    <button type="button" className="text-sm text-primary hover:underline">
                                      Forgot password?
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reset your password</DialogTitle>
                                      <DialogDescription>
                                        Enter your email and we'll send you a link to reset your password.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Form {...forgotPasswordForm}>
                                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                                        <FormField
                                          control={forgotPasswordForm.control}
                                          name="email"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Email</FormLabel>
                                              <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <DialogFooter>
                                          <Button 
                                            type="submit" 
                                            className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                                            disabled={isLoading.forgotPassword}
                                          >
                                            {isLoading.forgotPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Send Reset Link
                                          </Button>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
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
                      <CardFooter className="flex flex-col space-y-4">
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading.login}
                        >
                          {isLoading.login && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Login
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <button 
                            type="button" 
                            className="text-primary hover:underline focus:outline-none"
                            onClick={() => setActiveTab('signup')}
                          >
                            Sign up now
                          </button>
                        </p>
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
                              {providerPassword && renderPasswordStrengthIndicator()}
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
                      className="object-
