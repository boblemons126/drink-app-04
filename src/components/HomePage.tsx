
import React from 'react';
import { Beer, Users, Share, Mic, Settings, Play, TrendingUp, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenSetup: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSetup }) => {
  const features = [
    {
      id: 'drinks',
      title: 'Drink Tracker',
      description: 'Track drinks and spending with your crew',
      icon: Beer,
      color: 'from-blue-500 to-cyan-500',
      stats: '12 drinks tonight'
    },
    {
      id: 'games',
      title: 'Party Games',
      description: 'Break the ice with drinking games',
      icon: Mic,
      color: 'from-purple-500 to-pink-500',
      stats: '8+ game modes'
    },
    {
      id: 'group',
      title: 'Squad Manager',
      description: 'Manage your night out crew',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      stats: '4 friends online'
    },
    {
      id: 'memories',
      title: 'Night Memories',
      description: 'Capture and share epic moments',
      icon: Camera,
      color: 'from-orange-500 to-red-500',
      stats: '15 photos saved'
    }
  ];

  const quickActions = [
    {
      title: 'Quick Check-in',
      description: 'Share your location',
      icon: MapPin,
      action: () => onNavigate('group')
    },
    {
      title: 'Take Photo',
      description: 'Capture the moment',
      icon: Camera,
      action: () => onNavigate('memories')
    },
    {
      title: 'Start Game',
      description: 'Break the ice',
      icon: Play,
      action: () => onNavigate('games')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 top-20 left-10"></div>
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-400 bottom-20 right-10"></div>
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 p-6 pb-32 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10"></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Night Out
              </h1>
              <p className="text-slate-600 font-medium">Your ultimate party companion 🎉</p>
            </div>
            <Button
              onClick={onOpenSetup}
              variant="outline"
              className="liquid-glass-button-outline p-3 rounded-2xl"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Current Status */}
        <div className="liquid-glass rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Tonight's Vibe
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">$48.50</p>
              <p className="text-sm text-slate-600">Group Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-sm text-slate-600">Venues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-sm text-slate-600">Squad Size</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className="liquid-glass-button-outline p-4 h-auto flex-col space-y-2 rounded-2xl"
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-semibold text-center">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Features</h2>
          <div className="grid gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className="friend-card rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 mb-1">{feature.description}</p>
                    <p className="text-sm font-semibold text-blue-600">{feature.stats}</p>
                  </div>
                  <div className="text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Reminder */}
        <div className="liquid-glass rounded-3xl p-6 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <span className="mr-2">🛡️</span>
            Stay Safe Tonight
          </h3>
          <div className="space-y-1 text-sm text-slate-600">
            <p>• Always stay with your group</p>
            <p>• Drink responsibly and stay hydrated</p>
            <p>• Have a safe ride home planned</p>
          </div>
        </div>

        {/* Get Started */}
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate('drinks')}
            className="liquid-glass-button w-full py-4 rounded-2xl text-lg font-semibold"
          >
            <Beer className="w-6 h-6 mr-2" />
            Start Tracking Drinks
          </Button>
          
          <Button 
            onClick={() => onNavigate('games')}
            variant="outline"
            className="liquid-glass-button-outline w-full py-4 rounded-2xl font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Party Games
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
