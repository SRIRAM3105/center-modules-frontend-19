
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  image?: string;
  background?: string;
}

const ProjectPresentation = () => {
  const slides: Slide[] = [
    {
      title: "Community Solar Platform",
      content: "A comprehensive solution for community solar adoption and management",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      background: "bg-gradient-to-r from-solar-500/20 to-eco-500/20"
    },
    {
      title: "User Registration",
      content: "Easy onboarding process allowing users to create accounts and join existing communities or create new ones",
      image: "/lovable-uploads/469fe02e-dec9-4c4e-902e-dc07bc5445ef.png",
      background: "bg-solar-50"
    },
    {
      title: "Data Collection",
      content: "Intelligent energy usage analysis to provide personalized solar recommendations",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Provider Matching",
      content: "Connect with verified solar providers and get competitive installation quotes",
      image: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Cost Distribution",
      content: "Fair allocation of costs among community members based on usage needs",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "Payment Processing",
      content: "Secure payment handling for initial costs and monthly contributions",
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Energy Monitoring",
      content: "Real-time tracking of energy production and consumption with detailed analytics",
      image: "https://images.unsplash.com/photo-1581092335397-9fa341596dc6?auto=format&fit=crop&w=2070&q=80",
      background: "bg-eco-50"
    },
    {
      title: "PDF Report Generation",
      content: "Comprehensive reports for cost distribution and system performance",
      image: "https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?auto=format&fit=crop&w=2070&q=80",
      background: "bg-solar-50"
    },
    {
      title: "Thank You!",
      content: "Making solar energy accessible, affordable, and impactful for communities",
      image: "https://images.unsplash.com/photo-1508001300512-f1a481aec887?auto=format&fit=crop&w=2070&q=80",
      background: "bg-gradient-to-r from-eco-500/20 to-solar-500/20"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div 
        className={`w-full max-w-5xl rounded-xl overflow-hidden shadow-elegant ${slides[currentSlide].background}`}
      >
        <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{slides[currentSlide].content}</p>
            <div className="flex items-center gap-2">
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
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="rounded-lg overflow-hidden shadow-md">
              {slides[currentSlide].image && (
                <AspectRatio ratio={16/9}>
                  <img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPresentation;
