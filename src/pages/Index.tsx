
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DrinkTracker from '@/components/DrinkTracker';
import DrinkingGames from '@/components/DrinkingGames';
import GroupManager from '@/components/GroupManager';
import MemoryCapture from '@/components/MemoryCapture';

const Index = () => {
  const [activeTab, setActiveTab] = useState('drinks');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'drinks':
        return <DrinkTracker />;
      case 'games':
        return <DrinkingGames />;
      case 'group':
        return <GroupManager />;
      case 'memories':
        return <MemoryCapture />;
      default:
        return <DrinkTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-nightlife-black text-white">
      <div className="relative">
        {renderActiveTab()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
