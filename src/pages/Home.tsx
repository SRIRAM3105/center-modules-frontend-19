
import React from 'react';
import { HeroSection } from '@/components/shared/HeroSection';
import { Section } from '@/components/shared/Section';
import { FeatureCard } from '@/components/shared/FeatureCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, BarChart2, Users, Sun, Zap, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection
        title="Harness the Power of Community Solar"
        subtitle="Join forces with your community to make solar energy more accessible, affordable, and impactful for everyone."
        primaryButtonText="Get Started"
        primaryButtonLink="/registration"
        secondaryButtonText="Learn More"
        secondaryButtonLink="#features"
        image="/lovable-uploads/469fe02e-dec9-4c4e-902e-dc07bc5445ef.png"
      />

      <Section id="features" className="bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="section-title">One Platform, Complete Solar Journey</h2>
          <p className="section-subtitle">
            From joining a community to tracking your energy savings, our platform offers a seamless experience for community solar adoption.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="User Registration & Community"
            description="Sign up easily and join existing solar communities or create your own in your neighborhood."
            icon={UserPlus}
            className="animate-scale-in [animation-delay:100ms]"
          />
          <FeatureCard
            title="Data Collection & Plan Calculation"
            description="Input your energy usage data and get a customized solar plan that fits your needs and budget."
            icon={BarChart2}
            className="animate-scale-in [animation-delay:200ms]"
          />
          <FeatureCard
            title="Provider Matching & Installation"
            description="Get matched with certified installers, request quotes, and track the installation process."
            icon={Sun}
            className="animate-scale-in [animation-delay:300ms]"
          />
          <FeatureCard
            title="Community Decision Making"
            description="Participate in democratic decision-making processes to select providers and plans."
            icon={Users}
            className="animate-scale-in [animation-delay:400ms]"
          />
          <FeatureCard
            title="Payment & Cost-Sharing"
            description="Handle payments securely and distribute costs fairly among community members."
            icon={CreditCard}
            className="animate-scale-in [animation-delay:500ms]"
          />
          <FeatureCard
            title="Energy Monitoring & Support"
            description="Track energy production and consumption in real-time, and get support when needed."
            icon={Zap}
            className="animate-scale-in [animation-delay:600ms]"
          />
        </div>
      </Section>

      <Section className="bg-gradient-to-r from-solar-500/10 to-eco-500/10">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="animate-slide-in-right">
            <h2 className="section-title">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Register & Join</h3>
                  <p className="text-muted-foreground">Create an account and join an existing community or start your own.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share Your Data</h3>
                  <p className="text-muted-foreground">Input your energy consumption data to get a customized solar plan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Find Providers</h3>
                  <p className="text-muted-foreground">Get matched with certified solar installers and request quotes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Track & Save</h3>
                  <p className="text-muted-foreground">Monitor your energy production and savings in real-time.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/registration">
                <Button className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                  Start Your Solar Journey
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-elegant bg-white p-1 animate-slide-in-left">
            <img
              src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Solar panels on a residential roof"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-muted/20">
        <div className="text-center max-w-3xl mx-auto animate-slide-up">
          <h2 className="section-title">Ready to Join the Solar Revolution?</h2>
          <p className="section-subtitle">
            Take the first step towards sustainable energy and join a community of like-minded individuals committed to making a difference.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/registration">
              <Button size="lg" className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                Get Started Now
              </Button>
            </Link>
            <Link to="/data-collection">
              <Button variant="outline" size="lg" className="button-animation">
                Calculate Your Savings
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
