
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('animate-fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('animate-fade-out');
    }
  }, [location, displayLocation]);

  return (
    <div
      className={cn('transition-opacity duration-300 ease-apple', transitionStage)}
      onAnimationEnd={() => {
        if (transitionStage === 'animate-fade-out') {
          setTransitionStage('animate-fade-in');
          setDisplayLocation(location);
        }
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
