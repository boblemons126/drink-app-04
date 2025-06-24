
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Wine, Gamepad2, Users, Calendar, Camera, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { signOut } = useAuth();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'group', icon: Users, label: 'Groups' },
    { id: 'sessions', icon: Calendar, label: 'Sessions' },
    { id: 'drinks', icon: Wine, label: 'Drinks' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'memories', icon: Camera, label: 'Memories' }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-cyan-400' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
        
        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex flex-col items-center space-y-1 h-auto py-2 px-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-medium">Exit</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
