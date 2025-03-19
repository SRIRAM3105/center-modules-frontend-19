
import React from 'react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Zap, AlertCircle, CheckCircle2, Sun, CloudSun, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample data for charts
const energyData = [
  { date: 'Jan', production: 380, consumption: 400, baseline: 520 },
  { date: 'Feb', production: 420, consumption: 380, baseline: 510 },
  { date: 'Mar', production: 500, consumption: 420, baseline: 530 },
  { date: 'Apr', production: 580, consumption: 450, baseline: 540 },
  { date: 'May', production: 680, consumption: 470, baseline: 550 },
  { date: 'Jun', production: 750, consumption: 500, baseline: 560 },
  { date: 'Jul', production: 740, consumption: 520, baseline: 570 },
  { date: 'Aug', production: 700, consumption: 510, baseline: 565 },
  { date: 'Sep', production: 650, consumption: 490, baseline: 550 },
  { date: 'Oct', production: 550, consumption: 460, baseline: 540 },
  { date: 'Nov', production: 450, consumption: 440, baseline: 530 },
  { date: 'Dec', production: 400, consumption: 430, baseline: 525 },
];

const savingsData = [
  { month: 'Jan', savings: 6000 },
  { month: 'Feb', savings: 6500 },
  { month: 'Mar', savings: 5500 },
  { month: 'Apr', savings: 4500 },
  { month: 'May', savings: 4000 },
  { month: 'Jun', savings: 3000 },
  { month: 'Jul', savings: 2500 },
  { month: 'Aug', savings: 2750 },
  { month: 'Sep', savings: 3000 },
  { month: 'Oct', savings: 4000 },
  { month: 'Nov', savings: 4500 },
  { month: 'Dec', savings: 5000 },
];

const dailyData = [
  { time: '8am', production: 0.2 },
  { time: '9am', production: 0.5 },
  { time: '10am', production: 0.8 },
  { time: '11am', production: 1.3 },
  { time: '12pm', production: 1.8 },
  { time: '1pm', production: 2.0 },
  { time: '2pm', production: 1.9 },
  { time: '3pm', production: 1.6 },
  { time: '4pm', production: 1.2 },
  { time: '5pm', production: 0.7 },
  { time: '6pm', production: 0.3 },
  { time: '7pm', production: 0.1 },
];

const Monitoring = () => {
  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="space-y-6 max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center space-x-2">
            <span className="rounded-full bg-primary/10 p-1">
              <Zap className="h-4 w-4 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Energy Monitoring & Support</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Track Your Solar Performance
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor your energy production, consumption, and savings in real-time, and get support when you need it.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="usage-tracking" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="usage-tracking">Usage Tracking</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance Support</TabsTrigger>
            </TabsList>

            <TabsContent value="usage-tracking" className="animate-fade-in">
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-soft animate-scale-in [animation-delay:100ms]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Sun className="h-4 w-4 mr-2 text-solar-500" />
                        Today's Production
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">12.5 kWh</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        88% of daily average
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-xs text-primary">
                        <CloudSun className="h-3 w-3 mr-1" />
                        Partly cloudy today
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className="shadow-soft animate-scale-in [animation-delay:200ms]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-eco-500" />
                        Monthly Savings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">₹4,162</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        +12% from last month
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-xs text-eco-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        On track to meet annual goal
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className="shadow-soft animate-scale-in [animation-delay:300ms]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-primary">Operational</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        All components working normally
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-xs text-primary">
                        <Sun className="h-3 w-3 mr-1" />
                        Last checked: Today, 10:15 AM
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <Card className="shadow-soft animate-slide-up">
                  <CardHeader>
                    <CardTitle>Annual Energy Overview</CardTitle>
                    <CardDescription>
                      Compare your solar production, consumption, and baseline usage before solar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={energyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="production" 
                            stroke="#A3C219" 
                            activeDot={{ r: 8 }} 
                            name="Solar Production (kWh)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="consumption" 
                            stroke="#27A18A" 
                            name="Current Consumption (kWh)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="baseline" 
                            stroke="#9F9EA1" 
                            strokeDasharray="5 5" 
                            name="Baseline (Before Solar)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="shadow-soft animate-slide-in-right">
                    <CardHeader>
                      <CardTitle>Monthly Savings</CardTitle>
                      <CardDescription>
                        Track your financial savings from solar energy.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={savingsData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₹${value}`, 'Savings']} />
                            <Bar 
                              dataKey="savings" 
                              name="Savings (₹)" 
                              fill="#27A18A" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Annual Savings</span>
                          <span className="text-sm font-bold">₹47,250</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">ROI Progress</span>
                          <span className="text-sm font-bold">18%</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className="shadow-soft animate-slide-in-left">
                    <CardHeader>
                      <CardTitle>Today's Production</CardTitle>
                      <CardDescription>
                        Hourly solar energy production for today.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={dailyData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} kW`, 'Production']} />
                            <Area 
                              type="monotone" 
                              dataKey="production" 
                              stroke="#A3C219" 
                              fill="url(#colorProduction)" 
                              name="Production (kW)"
                            />
                            <defs>
                              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#A3C219" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#A3C219" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex items-center space-x-1 text-sm">
                          <Sun className="h-4 w-4 text-amber-500" />
                          <span>Peak: 2.0 kW at 1pm</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Cloud className="h-4 w-4 text-gray-400" />
                          <span>Weather impact: -15%</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="shadow-soft h-full animate-slide-in-right">
                    <CardHeader>
                      <CardTitle>System Health</CardTitle>
                      <CardDescription>
                        Current status of your solar energy system.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { 
                          component: "Solar Panels", 
                          status: "Operational", 
                          lastChecked: "Today, 10:15 AM",
                          icon: Sun
                        },
                        { 
                          component: "Inverter", 
                          status: "Operational", 
                          lastChecked: "Today, 10:15 AM",
                          icon: Zap
                        },
                        { 
                          component: "Battery Storage", 
                          status: "Not Installed", 
                          lastChecked: "-",
                          icon: CheckCircle2
                        },
                        { 
                          component: "Monitoring System", 
                          status: "Operational", 
                          lastChecked: "Today, 10:15 AM",
                          icon: CheckCircle2
                        },
                        { 
                          component: "Grid Connection", 
                          status: "Operational", 
                          lastChecked: "Today, 10:15 AM",
                          icon: CheckCircle2
                        }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        const isOperational = item.status === "Operational";
                        
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 h-7 w-7 rounded-full ${isOperational ? 'bg-eco-100' : 'bg-muted'} flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${isOperational ? 'text-eco-600' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">{item.component}</h3>
                                <Badge status={isOperational ? "green" : "neutral"}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Last checked: {item.lastChecked}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full button-animation">
                        Run System Diagnostic
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <Card className="shadow-soft animate-slide-in-left">
                    <CardHeader>
                      <CardTitle>Maintenance History</CardTitle>
                      <CardDescription>
                        Record of maintenance activities and system checks.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            date: "June 15, 2023",
                            activity: "Routine Maintenance",
                            description: "Annual inspection of all system components, panels cleaned, and connections checked.",
                            technician: "John M.",
                            status: "Completed"
                          },
                          {
                            date: "March 3, 2023",
                            activity: "Inverter Firmware Update",
                            description: "Updated inverter firmware to latest version for improved efficiency and security.",
                            technician: "Remote",
                            status: "Completed"
                          },
                          {
                            date: "November 12, 2022",
                            activity: "Panel Cleaning",
                            description: "Removed debris and dust from panels to maintain optimal production.",
                            technician: "Sarah L.",
                            status: "Completed"
                          }
                        ].map((item, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border bg-white">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">{item.activity}</h3>
                              <span className="text-sm text-muted-foreground">{item.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                            <div className="flex justify-between text-xs">
                              <span>Technician: {item.technician}</span>
                              <Badge status="green">{item.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full button-animation">
                        View Full History
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="shadow-soft animate-slide-in-left">
                    <CardHeader>
                      <CardTitle>Issue Reporting</CardTitle>
                      <CardDescription>
                        Report any issues with your solar system for prompt assistance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-lg p-4 flex items-start space-x-4 button-animation cursor-pointer border border-transparent hover:border-primary/20 hover:bg-primary/5">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Report System Issue</h3>
                            <p className="text-sm text-muted-foreground">
                              If you notice a problem with your system or production.
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4 flex items-start space-x-4 button-animation cursor-pointer border border-transparent hover:border-primary/20 hover:bg-primary/5">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Schedule Maintenance</h3>
                            <p className="text-sm text-muted-foreground">
                              Request routine cleaning or maintenance service.
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4 flex items-start space-x-4 button-animation cursor-pointer border border-transparent hover:border-primary/20 hover:bg-primary/5">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Contact Support</h3>
                            <p className="text-sm text-muted-foreground">
                              Get help from our technical support team.
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4 flex items-start space-x-4 button-animation cursor-pointer border border-transparent hover:border-primary/20 hover:bg-primary/5">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Knowledge Base</h3>
                            <p className="text-sm text-muted-foreground">
                              Browse FAQs and troubleshooting guides.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </div>
  );
};

const Badge = ({ status, children }: { status: "green" | "red" | "amber" | "neutral"; children: React.ReactNode }) => {
  const colors = {
    green: "bg-eco-500 text-white",
    red: "bg-red-500 text-white",
    amber: "bg-amber-500 text-white",
    neutral: "bg-muted text-muted-foreground"
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {children}
    </span>
  );
};

const AreaChart = ({ children, ...props }: any) => {
  return <LineChart {...props}>{children}</LineChart>;
};

const Area = ({ children, ...props }: any) => {
  return <Line {...props}>{children}</Line>;
};

const MessageSquare = ({ className }: { className?: string }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BookOpen = ({ className }: { className?: string }) => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

export default Monitoring;
