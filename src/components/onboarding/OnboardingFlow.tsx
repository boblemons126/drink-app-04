
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Users, Calendar, Shield, Gamepad2, Camera, Wine } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to DRNKUP",
      subtitle: "Your ultimate night out companion",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-neon-pulse">
            DRNKUP
          </div>
          <p className="text-lg text-slate-300 max-w-md mx-auto">
            Plan epic nights out with your friends, track your adventures, and create unforgettable memories safely.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-white">Friend Groups</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white">Plan Sessions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Wine className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white">Track Drinks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Shield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-white">Stay Safe</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Organize Your Crew",
      subtitle: "Create groups and plan together",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Friend Groups</h3>
            <p className="text-slate-300">
              Create permanent groups like "Weekend Crew" or "Work Buddies". Invite friends with unique codes and manage your circles easily.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Calendar className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Plan Sessions</h3>
            <p className="text-slate-300">
              Create detailed night out plans, set budgets, arrange transport, and collaborate with your group in real-time.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Stay Safe & Have Fun",
      subtitle: "Built-in safety features for worry-free nights",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Shield className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Safety First</h3>
            <p className="text-slate-300">
              Set emergency contacts, track eating habits, plan transport home, and keep your group informed about your status.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Camera className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-white">Capture Memories</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Gamepad2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm text-white">Party Games</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            {/* Progress indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-cyan-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="text-center space-y-6 min-h-[400px]">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-slate-400">
                  {steps[currentStep].subtitle}
                </p>
              </div>
              
              <div className="py-4">
                {steps[currentStep].content}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
