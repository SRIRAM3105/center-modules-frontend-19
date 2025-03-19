
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
  imagePosition?: 'right' | 'left';
  showPattern?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  image,
  primaryButtonText,
  primaryButtonLink = '/',
  secondaryButtonText,
  secondaryButtonLink = '/',
  className,
  imagePosition = 'right',
  showPattern = true,
}) => {
  return (
    <section className={cn(
      'relative overflow-hidden pt-24 md:pt-32 pb-16',
      className
    )}>
      {showPattern && (
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      )}
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(
          'grid grid-cols-1 gap-12 items-center',
          image ? 'lg:grid-cols-2' : 'text-center max-w-3xl mx-auto',
          imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
        )}>
          <div className={cn(
            'flex flex-col',
            !image && 'items-center'
          )}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 animate-slide-up">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up [animation-delay:150ms]">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up [animation-delay:300ms]">
              {primaryButtonText && (
                <Link to={primaryButtonLink}>
                  <Button 
                    size="lg" 
                    className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                  >
                    {primaryButtonText}
                  </Button>
                </Link>
              )}
              {secondaryButtonText && (
                <Link to={secondaryButtonLink}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="button-animation"
                  >
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {image && (
            <div className={cn(
              'relative',
              imagePosition === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left',
              '[animation-delay:450ms]'
            )}>
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={image}
                  alt="Hero"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-solar-500/20 to-eco-500/20" />
              </div>
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-solar-500/30 to-eco-500/30 blur-3xl opacity-20 transform scale-150" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
