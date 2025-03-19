
import React, { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, User, Mail, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Registration = () => {
  const [activeTab, setActiveTab] = useState('signup');

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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your information to get started with your solar journey.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <Input id="name" placeholder="John Doe" className="pl-10" />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input id="email" type="email" placeholder="john@example.com" className="pl-10" />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input id="password" type="password" className="pl-10" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input id="confirm-password" type="password" className="pl-10" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/data-collection" className="w-full">
                      <Button className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                        Create Account
                      </Button>
                    </Link>
                  </CardFooter>
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
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Input id="login-email" type="email" placeholder="john@example.com" className="pl-10" />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <a href="#" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Input id="login-password" type="password" className="pl-10" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/data-collection" className="w-full">
                      <Button className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                        Login
                      </Button>
                    </Link>
                  </CardFooter>
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
              <div className="space-y-2">
                <Label htmlFor="search-community">Search by Location</Label>
                <Input id="search-community" placeholder="Enter your city or ZIP code" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full button-animation">
                Browse Communities
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-soft animate-scale-in [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Create a New Community</CardTitle>
              <CardDescription>
                Start your own solar community and invite neighbors to join your initiative.
              </CardDescription>
            </CardHeader>
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
              <div className="space-y-2">
                <Label htmlFor="community-name">Community Name</Label>
                <Input id="community-name" placeholder="Enter a name for your community" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                Create Community
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default Registration;
