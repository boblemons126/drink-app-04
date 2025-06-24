
import React from 'react';
import { Beer, Users, Share, Mic, Settings, Play, TrendingUp, MapPin, Camera, Calendar, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import { useAuth } from '@/hooks/use-auth';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenSetup: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSetup }) => {
  const { sessionData, startNewSession, resetSession } = useSession();
  const { user, signOut } = useAuth();

  const features = [
    {
      id: 'group',
      title: 'Groups',
      description: 'Create and manage friend circles',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      stats: `${sessionData.squadSize} friends online`
    },
    {
      id: 'sessions',
      title: 'Sessions',
      description: 'Plan your night out events',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      stats: 'Organize epic nights'
    },
    {
      id: 'drinks',
      title: 'Drink Tracker',
      description: 'Track drinks and spending with your crew',
      icon: Beer,
      color: 'from-blue-500 to-cyan-500',
      stats: `${sessionData.totalDrinks} drinks tonight`
    },
    {
      id: 'games',
      title: 'Party Games',
      description: 'Break the ice with drinking games',
      icon: Mic,
      color: 'from-orange-500 to-red-500',
      stats: '8+ game modes'
    },
    {
      id: 'memories',
      title: 'Night Memories',
      description: 'Capture and share epic moments',
      icon: Camera,
      color: 'from-pink-500 to-rose-500',
      stats: '15 photos saved'
    }
  ];

  const quickActions = [
    {
      title: 'Create Group',
      description: 'Start a friend circle',
      icon: Users,
      action: () => onNavigate('group')
    },
    {
      title: 'Plan Session',
      description: 'Organize night out',
      icon: Calendar,
      action: () => onNavigate('sessions')
    },
    {
      title: 'Take Photo',
      description: 'Capture the moment',
      icon: Camera,
      action: () => onNavigate('memories')
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
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
              <h1 className="text-4xl font-bold text-white mb-2">
                DRNKUP
              </h1>
              <p className="text-slate-300 font-medium">Your ultimate party companion 🎉</p>
              {user && (
                <p className="text-slate-400 text-sm mt-1">Welcome back!</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={onOpenSetup}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-3 rounded-2xl"
              >
                <Settings className="w-6 h-6" />
              </Button>
              <Button
                onClick={signOut}
                variant="outline"
                className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 p-3 rounded-2xl"
              >
                <Crown className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
              Tonight's Vibe
            </h2>
            {sessionData.sessionStartTime && (
              <Button
                onClick={resetSession}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reset Session
              </Button>
            )}
          </div>
          
          {!sessionData.sessionStartTime ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-white mb-2">No Active Session</h3>
              <p className="text-slate-300 mb-4">Start tracking your night out to see your stats here!</p>
              <Button
                onClick={startNewSession}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl"
              >
                Start New Session
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-400">${sessionData.groupTotal.toFixed(2)}</p>
                  <p className="text-sm text-slate-400">Group Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{sessionData.venuesVisited}</p>
                  <p className="text-sm text-slate-400">Venues</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{sessionData.squadSize}</p>
                  <p className="text-sm text-slate-400">Squad Size</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 p-4 h-auto flex-col space-y-2 rounded-2xl"
                variant="outline"
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-semibold text-center">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Features</h2>
          <div className="grid gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/15"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-300 mb-1">{feature.description}</p>
                    <p className="text-sm font-semibold text-blue-400">{feature.stats}</p>
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
        <div className="bg-white/10 backdrop-blur-md border border-amber-400/30 rounded-3xl p-6 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center">
            <span className="mr-2">🛡️</span>
            Stay Safe Tonight
          </h3>
          <div className="space-y-1 text-sm text-slate-300">
            <p>• Always stay with your group</p>
            <p>• Drink responsibly and stay hydrated</p>
            <p>• Have a safe ride home planned</p>
          </div>
        </div>

        {/* Get Started */}
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate('group')}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 w-full py-4 rounded-2xl text-lg font-semibold"
          >
            <Users className="w-6 h-6 mr-2" />
            Manage Groups
          </Button>
          
          <Button 
            onClick={() => onNavigate('sessions')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full py-4 rounded-2xl font-semibold"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Plan Sessions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
