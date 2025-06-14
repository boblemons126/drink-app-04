
import React from 'react';
import { Beer, Users, Share, Mic, Home } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'drinks', label: 'Drinks', icon: Beer },
    { id: 'games', label: 'Games', icon: Mic },
    { id: 'group', label: 'Group', icon: Users },
    { id: 'memories', label: 'Memories', icon: Share },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4">
      <div className="liquid-nav rounded-3xl p-3">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-item flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                  isActive ? 'active' : 'text-slate-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
