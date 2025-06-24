
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import DrinkTracker from '@/components/DrinkTracker';
import DrinkingGames from '@/components/DrinkingGames';
import GroupsManager from '@/components/groups/GroupsManager';
import SessionsManager from '@/components/sessions/SessionsManager';
import MemoryCapture from '@/components/MemoryCapture';
import DrinkSetup from '@/components/DrinkSetup';
import Auth from '@/components/Auth';
import { SessionProvider } from '@/hooks/use-session';
import { AuthProvider, useAuth } from '@/hooks/use-auth';

interface DrinkType {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSetup, setShowSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [drinkPrices, setDrinkPrices] = useState<DrinkType[]>([
    { id: 'beer', name: 'Beer', price: 6.50, emoji: '🍺' },
    { id: 'wine', name: 'Wine', price: 8.00, emoji: '🍷' },
    { id: 'cocktail', name: 'Cocktail', price: 12.00, emoji: '🍸' },
    { id: 'shot', name: 'Shot', price: 5.00, emoji: '🥃' },
    { id: 'mixed_drink', name: 'Mixed Drink', price: 10.00, emoji: '🍹' }
  ]);

  useEffect(() => {
    // Check if user has seen onboarding before (even without authentication)
    const onboardingSeen = localStorage.getItem('onboardingSeen');
    if (onboardingSeen) {
      setHasSeenOnboarding(true);
    }

    if (user) {
      // Check if user has completed setup before
      const savedPrices = localStorage.getItem('drinkPrices');
      const setupCompleted = localStorage.getItem('setupCompleted');
      
      if (savedPrices) {
        setDrinkPrices(JSON.parse(savedPrices));
      }
      
      if (setupCompleted) {
        setHasCompletedSetup(true);
      } else {
        setShowSetup(true);
      }
    }
  }, [user]);

  const handleSetupComplete = (prices: DrinkType[]) => {
    setDrinkPrices(prices);
    setShowSetup(false);
    setHasCompletedSetup(true);
    localStorage.setItem('setupCompleted', 'true');
  };

  const openSetup = () => {
    setShowSetup(true);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('onboardingSeen', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-white">DRNKUP</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show onboarding to all users who haven't seen it yet (even if they're already authenticated)
  if (!hasSeenOnboarding) {
    return <Auth onOnboardingComplete={handleOnboardingComplete} />;
  }

  // Show auth flow for unauthenticated users who have seen onboarding
  if (!user) {
    return <Auth onOnboardingComplete={handleOnboardingComplete} skipOnboarding={true} />;
  }

  if (showSetup) {
    return (
      <DrinkSetup
        onComplete={handleSetupComplete}
        onBack={() => hasCompletedSetup && setShowSetup(false)}
        existingPrices={drinkPrices}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onOpenSetup={openSetup} />;
      case 'drinks':
        return <DrinkTracker onOpenSetup={openSetup} drinkPrices={drinkPrices} />;
      case 'games':
        return <DrinkingGames />;
      case 'group':
        return <GroupsManager />;
      case 'sessions':
        return <SessionsManager />;
      case 'memories':
        return <MemoryCapture />;
      default:
        return <HomePage onNavigate={handleNavigate} onOpenSetup={openSetup} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        {renderActiveTab()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </AuthProvider>
  );
};

export default Index;
