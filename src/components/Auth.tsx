
import React, { useState } from 'react';
import OnboardingFlow from './onboarding/OnboardingFlow';
import SSOAuth from './auth/SSOAuth';

interface AuthProps {
  onOnboardingComplete: () => void;
  skipOnboarding?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onOnboardingComplete, skipOnboarding = false }) => {
  const [showAuth, setShowAuth] = useState(skipOnboarding);

  const handleOnboardingComplete = () => {
    setShowAuth(true);
  };

  const handleBackToOnboarding = () => {
    if (!skipOnboarding) {
      setShowAuth(false);
    }
  };

  const handleAuthComplete = () => {
    onOnboardingComplete();
  };

  if (showAuth) {
    return (
      <SSOAuth 
        onBack={handleBackToOnboarding} 
        onComplete={handleAuthComplete}
        showBackButton={!skipOnboarding}
      />
    );
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default Auth;
