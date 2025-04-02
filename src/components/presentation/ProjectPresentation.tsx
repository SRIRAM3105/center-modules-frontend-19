import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight, FullscreenIcon, MinimizeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  title: string;
  content: React.ReactNode;
  image?: string;
  background?: string;
  section?: string;
}

const ProjectPresentation = () => {
  const slides: Slide[] = [
    {
      title: "Community Solar Platform",
      content: "A comprehensive solution for community solar adoption and management",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      background: "bg-gradient-to-r from-solar-500/20 to-eco-500/20"
    },
    // First Review
    {
      title: "Block Diagram of Proposed Solution",
      section: "First Review",
      content: (
        <div>
          <p className="mb-4">Our solution addresses the societal challenge of limited solar adoption due to high costs and complex implementation.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
            <div className="bg-solar-50 p-3 rounded-lg">
              <h4 className="font-bold mb-1">User Interface Layer</h4>
              <p>Registration, Data Input, Visualization</p>
            </div>
            <div className="bg-solar-50 p-3 rounded-lg">
              <h4 className="font-bold mb-1">Business Logic Layer</h4>
              <p>Matching Algorithm, Cost Distribution, Energy Calculations</p>
            </div>
            <div className="bg-solar-50 p-3 rounded-lg">
              <h4 className="font-bold mb-1">Data Layer</h4>
              <p>User Profiles, Energy Data, Provider Database</p>
            </div>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "New Contributions & Algorithms",
      section: "First Review",
      content: (
        <div>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-semibold">Community-Based Provider Matching:</span> Enhanced algorithm that factors in community location density for optimal solar panel placement</li>
            <li><span className="font-semibold">Dynamic Cost Distribution:</span> Algorithm that fairly allocates costs based on anticipated usage patterns and property characteristics</li>
            <li><span className="font-semibold">Energy Production Forecasting:</span> Machine learning model that predicts energy output based on historical weather patterns and geographical data</li>
          </ul>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Detailed Design: Registration Module",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">The registration module handles user onboarding and community group formation:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-semibold">User Authentication:</span> JWT token-based secure login system</li>
            <li><span className="font-semibold">Community Creation:</span> Geolocation-based community grouping</li>
            <li><span className="font-semibold">Profile Management:</span> Energy usage history upload and property details</li>
            <li><span className="font-semibold">Permission System:</span> Role-based access for community administrators</li>
          </ul>
          <p className="mt-3 text-xs">Technologies: React Hook Form, JWT Authentication, Geolocation API</p>
        </div>
      ),
      image: "/lovable-uploads/469fe02e-dec9-4c4e-902e-dc07bc5445ef.png",
      background: "bg-eco-50"
    },
    {
      title: "Detailed Design: Data Collection Module",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">The data collection module gathers essential information for system sizing:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-semibold">Energy Usage Import:</span> Direct utility API integration</li>
            <li><span className="font-semibold">Property Analysis:</span> Roof orientation, shade analysis via satellite imagery</li>
            <li><span className="font-semibold">Consumption Patterns:</span> Time-of-use energy profiling</li>
            <li><span className="font-semibold">Data Visualization:</span> Interactive charts for usage analysis</li>
          </ul>
          <p className="mt-3 text-xs">Technologies: Recharts, API Integration, Smart Meter Data Processing</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Detailed Design: Provider Matching Module",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">The provider matching module connects communities with qualified installers:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-semibold">Provider Database:</span> Verified installer network with ratings</li>
            <li><span className="font-semibold">Quote System:</span> Automated RFQ generation based on community needs</li>
            <li><span className="font-semibold">Comparison Tools:</span> Side-by-side proposal evaluation</li>
            <li><span className="font-semibold">Community Voting:</span> Democratic selection process</li>
          </ul>
          <p className="mt-3 text-xs">Technologies: Matching Algorithm, Provider API, Quote Comparison Engine</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Detailed Design: Payment Module",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">The payment module handles financial transactions and cost distribution:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-semibold">Payment Processing:</span> Secure transaction handling</li>
            <li><span className="font-semibold">Cost Distribution:</span> Algorithmic fair share calculation</li>
            <li><span className="font-semibold">Payment Plans:</span> Flexible payment options and schedules</li>
            <li><span className="font-semibold">Transaction History:</span> Transparent payment tracking</li>
          </ul>
          <p className="mt-3 text-xs">Technologies: Payment Gateway Integration, Secure Authentication, Cost Calculation Engine</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Detailed Design: Monitoring Module",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">The monitoring module tracks system performance and savings:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-semibold">Real-time Monitoring:</span> Energy production and consumption tracking</li>
            <li><span className="font-semibold">Analytics Dashboard:</span> Performance metrics and visualization</li>
            <li><span className="font-semibold">Savings Calculator:</span> Financial benefit analysis</li>
            <li><span className="font-semibold">Alert System:</span> Maintenance notifications and performance issues</li>
          </ul>
          <p className="mt-3 text-xs">Technologies: IoT Integration, Real-time Data Processing, Analytics Engine</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1581092335397-9fa341596dc6?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Evaluation Metrics",
      section: "First Review",
      content: (
        <div>
          <p className="mb-4">Key performance indicators used to evaluate our solution:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-solar-50/50 p-3 rounded-lg">
              <h4 className="font-bold mb-1">Technical Metrics</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">System Response Time:</span> 95% of requests complete in &lt;1.5s</li>
                <li><span className="font-semibold">User Retention Rate:</span> Target 85% retention over 12 months</li>
                <li><span className="font-semibold">Community Formation:</span> 70% of registered users join communities</li>
                <li><span className="font-semibold">Provider Quality:</span> 90% match satisfaction based on post-installation surveys</li>
                <li><span className="font-semibold">System Uptime:</span> 99.9% availability with scheduled maintenance windows</li>
                <li><span className="font-semibold">Error Rate:</span> &lt;0.5% transaction failure rate across all modules</li>
              </ul>
            </div>
            <div className="bg-eco-50/50 p-3 rounded-lg">
              <h4 className="font-bold mb-1">Impact Metrics</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">Clean Energy Production:</span> Target 25MW total capacity installed within 24 months</li>
                <li><span className="font-semibold">CO₂ Reduction:</span> Estimated 15K metric tons CO₂ avoided annually</li>
                <li><span className="font-semibold">Cost Savings:</span> Average 20% reduction in household energy costs</li>
                <li><span className="font-semibold">Community Engagement:</span> 75% of members participate in at least 1 decision monthly</li>
                <li><span className="font-semibold">Local Economic Impact:</span> Creation of 150+ jobs in installation and maintenance</li>
                <li><span className="font-semibold">Education Reach:</span> 50K unique visitors to educational resources annually</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Test Cases",
      section: "First Review",
      content: (
        <div>
          <p className="mb-3">Our comprehensive testing strategy includes:</p>
          <div className="space-y-3 text-sm">
            <div className="bg-solar-50/40 p-2 rounded-lg">
              <h4 className="font-bold">Unit Tests</h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><span className="font-semibold">Registration Validation:</span> Test email format validation, password strength requirements, and address verification</li>
                <li><span className="font-semibold">Energy Calculation:</span> Verify correct energy generation estimates based on location, roof orientation, and panel efficiency</li>
                <li><span className="font-semibold">Cost Distribution:</span> Confirm fair-share algorithm correctly allocates costs based on various usage patterns</li>
                <li><span className="font-semibold">Provider Rating:</span> Test accuracy of provider matching score calculation with different input parameters</li>
              </ul>
            </div>
            <div className="bg-eco-50/40 p-2 rounded-lg">
              <h4 className="font-bold">Integration Tests</h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><span className="font-semibold">Registration → Community Formation:</span> Verify user flow from signup to joining/creating a community</li>
                <li><span className="font-semibold">Data Collection → Provider Matching:</span> Test seamless transfer of energy requirements to provider selection</li>
                <li><span className="font-semibold">Provider Selection → Payment Processing:</span> Validate contract generation and payment flow</li>
                <li><span className="font-semibold">Installation → Monitoring:</span> Confirm system registration and data feed initialization post-installation</li>
                <li><span className="font-semibold">API Integrations:</span> Test weather data, utility API, and payment gateway connections under various conditions</li>
              </ul>
            </div>
            <div className="bg-solar-50/40 p-2 rounded-lg">
              <h4 className="font-bold">User Acceptance Tests</h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><span className="font-semibold">Community Creation Scenario:</span> Users can create communities, invite neighbors, and establish governance rules</li>
                <li><span className="font-semibold">System Configuration:</span> Communities can compare system options, vote on preferences, and finalize selections</li>
                <li><span className="font-semibold">Provider Selection:</span> Communities can review bids, interact with providers, and make informed decisions</li>
                <li><span className="font-semibold">Payment Processing:</span> Members can select payment plans, process payments, and view transaction history</li>
                <li><span className="font-semibold">Energy Monitoring:</span> Users can view real-time production data, savings metrics, and performance alerts</li>
                <li><span className="font-semibold">Mobile Responsiveness:</span> All key workflows function correctly on various mobile devices and screen sizes</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    // Second Review
    {
      title: "Implementation: Pros and Cons",
      section: "Second Review",
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-bold mb-1 text-green-700">Pros</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Highly responsive React frontend</li>
                <li>Modular architecture for easy maintenance</li>
                <li>Optimized data processing algorithms</li>
                <li>Mobile-responsive design</li>
                <li>Accessibility compliant interface</li>
              </ul>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="font-bold mb-1 text-red-700">Cons</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Complex state management in large forms</li>
                <li>Initial loading time for data-heavy pages</li>
                <li>Limited offline functionality</li>
                <li>Dependency on third-party APIs</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm">
            <h4 className="font-bold mb-1 text-blue-700">Future Improvements</h4>
            <p>Implementing offline capabilities, adding a native mobile app version, and expanding the provider network internationally</p>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Code Implementation: Reused vs. Original",
      section: "Second Review",
      content: (
        <div className="text-sm">
          <div className="mb-4">
            <h4 className="font-bold text-base text-solar-700 mb-2">Reused Components/Libraries</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-semibold">UI Framework:</span> Leveraging shadcn/ui for consistent component design</li>
              <li><span className="font-semibold">Charting Library:</span> Recharts for energy usage visualization</li>
              <li><span className="font-semibold">Form Handling:</span> react-hook-form for validation and state management</li>
              <li><span className="font-semibold">State Management:</span> Tanstack Query for data fetching and caching</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base text-eco-700 mb-2">Original Implementations</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-semibold">Provider Matching Algorithm:</span> Custom logic for community-installer matching</li>
              <li><span className="font-semibold">Cost Distribution Engine:</span> Proprietary fair-share calculation system</li>
              <li><span className="font-semibold">Community Management System:</span> Custom workflows for group decision-making</li>
              <li><span className="font-semibold">Energy Monitoring Dashboard:</span> Tailored visualization for community solar data</li>
            </ul>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Code Sample: Provider Matching Algorithm",
      section: "Second Review",
      content: (
        <div>
          <p className="mb-2 text-sm">Our custom provider matching algorithm:</p>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs overflow-auto max-h-32">
{`// Provider matching algorithm pseudocode
function matchProviders(community, providers) {
  const communityLocation = getCommunityGeoCenter(community);
  const communitySize = community.members.length;
  const estimatedCapacity = calculateRequiredCapacity(community);
  
  return providers
    .filter(provider => 
      provider.serviceArea.contains(communityLocation) && 
      provider.capacityRange.contains(estimatedCapacity))
    .map(provider => ({
      ...provider,
      matchScore: calculateMatchScore(
        provider, 
        communityLocation,
        communitySize,
        estimatedCapacity
      )
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}`}
          </pre>
          <p className="mt-3 text-sm">This algorithm prioritizes providers based on proximity, capacity matching, and historical performance with similar communities.</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Code Sample: Energy Monitoring",
      section: "Second Review",
      content: (
        <div>
          <p className="mb-2 text-sm">Our real-time energy monitoring implementation:</p>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs overflow-auto max-h-32">
{`// Energy monitoring dashboard component
function EnergyMonitoringDashboard({ communityId }) {
  const { data: energyData } = useQuery({
    queryKey: ['energy', communityId],
    queryFn: () => fetchEnergyData(communityId),
    refetchInterval: 60000, // Update every minute
  });

  const { production, consumption, savings } = 
    processEnergyMetrics(energyData);
  
  return (
    <div className="dashboard-grid">
      <ProductionChart data={production} />
      <ConsumptionChart data={consumption} />
      <SavingsCalculator data={savings} />
      <AlertsPanel communityId={communityId} />
    </div>
  );
}`}
          </pre>
          <p className="mt-3 text-sm">The dashboard updates in real-time and provides actionable insights on system performance.</p>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Thank You!",
      content: "Making solar energy accessible, affordable, and impactful for communities",
      image: "https://images.unsplash.com/photo-1508001300512-f1a481aec887?auto=format&fit=crop&w=2070&q=80",
      background: "bg-gradient-to-r from-eco-500/20 to-solar-500/20"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'f') {
      toggleFullscreen();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const sections = slides.reduce((acc, slide) => {
    if (!slide.section) return acc;
    if (!acc[slide.section]) acc[slide.section] = [];
    acc[slide.section].push(slide);
    return acc;
  }, {} as Record<string, Slide[]>);

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4",
      isFullscreen && "fixed inset-0 z-50 bg-background"
    )}>
      <div 
        className={cn(
          "w-full max-w-6xl rounded-xl overflow-hidden shadow-elegant transition-all",
          slides[currentSlide].background,
          isFullscreen ? "h-screen max-h-screen rounded-none" : "max-h-[800px]"
        )}
      >
        <div className="p-6 md:p-12 h-full flex flex-col">
          {slides[currentSlide].section && (
            <div className="mb-6 flex items-center">
              <div className="text-sm font-medium text-muted-foreground">
                {slides[currentSlide].section}
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8 items-center flex-1">
            <div className="order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{slides[currentSlide].title}</h1>
              <div className="text-lg text-muted-foreground mb-8">{slides[currentSlide].content}</div>
              
              <div className="flex items-center gap-2 mt-auto pt-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevSlide}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 flex items-center justify-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'w-8 bg-solar-500' 
                          : 'w-2 bg-muted hover:bg-muted-foreground'
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={nextSlide} 
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="rounded-full ml-2"
                >
                  {isFullscreen ? (
                    <MinimizeIcon className="h-4 w-4" />
                  ) : (
                    <FullscreenIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              {slides[currentSlide].image && (
                <div className="rounded-lg overflow-hidden shadow-md">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={slides[currentSlide].image} 
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {Object.keys(sections).length > 0 && (
        <div className="mt-8 hidden md:flex gap-4 flex-wrap justify-center">
          {Object.entries(sections).map(([sectionName, sectionSlides]) => (
            <div key={sectionName} className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">{sectionName}</h3>
              <div className="flex gap-2">
                {sectionSlides.map((slide, idx) => {
                  const slideIndex = slides.findIndex(s => s.title === slide.title);
                  return (
                    <Button
                      key={idx}
                      variant={currentSlide === slideIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToSlide(slideIndex)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Press <span className="bg-muted px-2 py-0.5 rounded">←</span> or <span className="bg-muted px-2 py-0.5 rounded">→</span> to navigate, <span className="bg-muted px-2 py-0.5 rounded">F</span> for fullscreen
      </div>
    </div>
  );
};

export default ProjectPresentation;
