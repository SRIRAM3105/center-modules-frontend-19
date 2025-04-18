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
import { User, UserRole, RegistrationData } from '@/types/user';

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
                  <form onSubmit={handleSignup}>
                    <CardFooter>
                      <Button 
                        className="w-full bg-[#8B5CF6] text-white hover:bg-[#7E57C2]" 
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
                  <form onSubmit={handleLogin}>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button 
                        className="w-full bg-[#8B5CF6] text-white hover:bg-[#7E57C2]" 
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
