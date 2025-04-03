
import React from 'react';
import ProjectPresentation from '@/components/presentation/ProjectPresentation';

const PresentationPage = () => {
  return (
    <ProjectPresentation 
      additionalSections={[
        {
          title: "Provider Registration",
          content: "The platform offers registration for solar providers with specific information collection including name, contact details, location, and payment information (UPI ID). Providers go through a certification process after registration to ensure quality service."
        }
      ]}
    />
  );
};

export default PresentationPage;
