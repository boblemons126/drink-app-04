
import React, { useState } from 'react';
import OnboardingFlow from './onboarding/OnboardingFlow';
import PhoneAuth from './auth/PhoneAuth';

const Auth = () => {
  const [showAuth, setShowAuth] = useState(false);

  const handleOnboardingComplete = () => {
    setShowAuth(true);
  };

  const handleBackToOnboarding = () => {
    setShowAuth(false);
  };

  if (showAuth) {
    return <PhoneAuth onBack={handleBackToOnboarding} />;
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default Auth;
