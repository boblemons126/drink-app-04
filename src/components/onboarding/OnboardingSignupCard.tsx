import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParallaxIcon } from './ParallaxIcon';
import OnboardingAuth from './OnboardingAuth';

interface OnboardingSignupCardProps {
  onSignUp: () => void;
}

const OnboardingSignupCard: React.FC<OnboardingSignupCardProps> = ({ onSignUp }) => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <OnboardingAuth onComplete={onSignUp} onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <ParallaxIcon>
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6 shadow-lg"
        >
          <Rocket className="w-16 h-16 text-white" />
        </motion.div>
      </ParallaxIcon>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-extrabold text-white"
      >
        You're All Set!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-slate-300 max-w-md"
      >
        Ready to dive in and plan your first epic night?
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={() => setShowAuth(true)}
          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg px-8 py-3 text-lg"
        >
          Sign Up Now
        </Button>
      </motion.div>
    </div>
  );
};

export default OnboardingSignupCard; 