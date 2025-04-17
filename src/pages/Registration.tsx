
import React, { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/user'; // Ensure you have a user type defined

const Registration = () => {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('signup');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!firstName || !lastName) {
      toast({
        title: "Incomplete Information",
        description: "Please provide your first and last name.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(signupEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Determine roles based on provider status
      const roles: UserRole[] = isProvider 
        ? ['ROLE_USER', 'ROLE_PROVIDER'] 
        : ['ROLE_USER'];
      
      const result = await signup({
        email: signupEmail,
        password: signupPassword,
        firstName,
        lastName,
        phoneNumber,
        roles
      });
      
      if (result.success) {
        toast({
          title: "Welcome to Ray Unity!",
          description: "Your account has been created successfully."
        });
        
        // Redirect based on user type
        navigate(isProvider ? '/provider-dashboard' : '/community');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const result = await login(loginEmail, loginPassword);
      
      if (result.success) {
        // Redirect based on user roles
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isUserProvider = user.roles && user.roles.includes('ROLE_PROVIDER');
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Ray Unity!"
        });

        navigate(isUserProvider ? '/provider-dashboard' : '/community');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error 
          ? error.message 
          : "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-20 bg-gradient-to-br from-soft-purple to-soft-gray">
      <Section>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-8 text-dark-purple">
              Welcome to Ray Unity
            </h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-soft-gray">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup">
                <Card className="shadow-xl border-soft-purple/20">
                  <CardHeader>
                    <CardTitle className="text-primary-purple">Create Your Ray Unity Account</CardTitle>
                    <CardDescription>
                      Join our community solar platform and make a difference
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="border-soft-purple/50 focus:ring-primary-purple"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="border-soft-purple/50 focus:ring-primary-purple"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input 
                          id="phoneNumber" 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input 
                          id="signupPassword" 
                          type="password" 
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox 
                          id="isProvider" 
                          checked={isProvider}
                          onCheckedChange={(checked) => setIsProvider(checked as boolean)}
                        />
                        <Label 
                          htmlFor="isProvider" 
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          I am a solar provider
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-primary-purple hover:bg-secondary-purple" 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="login">
                <Card className="shadow-xl border-soft-purple/20">
                  <CardHeader>
                    <CardTitle className="text-primary-purple">Login to Ray Unity</CardTitle>
                    <CardDescription>
                      Access your community solar dashboard
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail">Email</Label>
                        <Input 
                          id="loginEmail" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="loginPassword">Password</Label>
                        <Input 
                          id="loginPassword" 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="border-soft-purple/50 focus:ring-primary-purple"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button 
                        className="w-full bg-primary-purple hover:bg-secondary-purple" 
                        type="submit" 
                        disabled={loginLoading}
                      >
                        {loginLoading ? "Logging in..." : "Login"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Registration;
