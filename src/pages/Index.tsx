
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import DrinkTracker from '@/components/DrinkTracker';
import DrinkingGames from '@/components/DrinkingGames';
import GroupManager from '@/components/GroupManager';
import MemoryCapture from '@/components/MemoryCapture';
import DrinkSetup from '@/components/DrinkSetup';

interface DrinkType {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSetup, setShowSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [drinkPrices, setDrinkPrices] = useState<DrinkType[]>([
    { id: 'beer', name: 'Beer', price: 6.50, emoji: '🍺' },
    { id: 'wine', name: 'Wine', price: 8.00, emoji: '🍷' },
    { id: 'cocktail', name: 'Cocktail', price: 12.00, emoji: '🍸' },
    { id: 'shot', name: 'Shot', price: 5.00, emoji: '🥃' },
    { id: 'mixed_drink', name: 'Mixed Drink', price: 10.00, emoji: '🍹' }
  ]);

  useEffect(() => {
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
  }, []);

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
        return <GroupManager />;
      case 'memories':
        return <MemoryCapture />;
      default:
        return <HomePage onNavigate={handleNavigate} onOpenSetup={openSetup} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative">
        {renderActiveTab()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
