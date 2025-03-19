
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
}

export const Section: React.FC<SectionProps> = ({ 
  className, 
  children, 
  id,
  fullWidth = false
}) => {
  return (
    <section 
      id={id} 
      className={cn(
        'py-16 md:py-24',
        className
      )}
    >
      <div className={fullWidth ? 'w-full' : 'container mx-auto px-4 md:px-6'}>
        {children}
      </div>
    </section>
  );
};

export default Section;
