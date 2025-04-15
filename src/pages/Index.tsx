
import React from 'react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/shared/Section';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sun, Users, Home, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-32 pb-24 bg-gradient-to-br from-solar-50 to-eco-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-right">
            <div className="inline-flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Sun className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Community Solar Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Harness the Power of the Sun Together
            </h1>
            <p className="text-xl text-muted-foreground">
              Join neighbors to build affordable solar energy systems, reduce costs, and create a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                onClick={() => navigate('/registration')}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="button-animation"
                onClick={() => navigate('/data-collection')}
              >
                Check Your Solar Potential
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-solar-100 to-eco-100 blur-3xl opacity-30 rounded-full" />
            <img 
              src="/placeholder.svg" 
              alt="Solar panels on rooftops" 
              className="rounded-xl shadow-2xl animate-slide-in-left"
            />
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="py-20 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our platform makes it simple to join the solar revolution through community-based initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Home className="h-10 w-10 text-solar-500" />,
              title: "Submit Your Home",
              description: "Provide details about your residence to get a personalized solar assessment."
            },
            {
              icon: <Users className="h-10 w-10 text-eco-500" />,
              title: "Join a Community",
              description: "Connect with neighbors to form a solar community and share installation costs."
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-solar-500" />,
              title: "Choose Providers",
              description: "Select from certified solar providers and vote on the best solution for your community."
            },
            {
              icon: <Activity className="h-10 w-10 text-eco-500" />,
              title: "Monitor & Save",
              description: "Track your energy production, savings, and environmental impact in real-time."
            }
          ].map((feature, index) => (
            <Card key={index} className="border-none shadow-soft animate-scale-in [animation-delay:200ms]">
              <CardHeader>
                <div className="p-2 w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Go Solar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of homeowners who have already made the switch to sustainable energy through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
              onClick={() => navigate('/registration')}
            >
              Create an Account
            </Button>
            <Button 
              variant="outline" 
              className="button-animation"
              onClick={() => navigate('/presentation')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Index;
