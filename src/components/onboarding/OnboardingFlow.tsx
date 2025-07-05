import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Users, Wine, Gamepad2, Rocket, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ParallaxIcon } from './ParallaxIcon';
import OnboardingSignupCard from './OnboardingSignupCard';
import LiquidGlassCard from '../ui/LiquidGlassCard';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const features = [
    {
      icon: Users,
      title: "Squad Up",
      description: "Create groups, invite friends, and see who's ready to party."
    },
    {
      icon: Wine,
      title: "Track the Vibe",
      description: "Keep tabs on drinks and spending for the whole group, in real-time."
    },
    {
      icon: Gamepad2,
      title: "Drinking Games",
      description: "Break the ice with fun and interactive drinking games."
    }
  ];

  const steps = [
    {
      key: "welcome",
      content: (
        <div className="flex flex-col items-center text-center space-y-4">
          <ParallaxIcon>
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500/25 to-pink-500/25 backdrop-blur-sm border border-purple-300/40 rounded-full p-6 shadow-2xl relative overflow-hidden"
            >
              <PartyPopper className="w-16 h-16 text-purple-200 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse"></div>
            </motion.div>
          </ParallaxIcon>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent"
          >
            Welcome to DRNKUP
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="text-lg text-purple-100/90 max-w-md leading-relaxed"
          >
            Your ultimate companion for unforgettable nights out. Let's get you set up.
          </motion.p>
        </div>
      )
    },
    ...features.map((feature, index) => ({
      key: `feature-${index}`,
      content: (
        <div className="relative w-full h-96 flex items-center justify-center">
          {features.map((bgFeature, bgIndex) => {
            const isCurrent = index === bgIndex;
            const offset = bgIndex - index;
            
            return (
              <motion.div
                key={`bg-${bgIndex}`}
                className="absolute"
                initial={{
                  x: offset * 100,
                  scale: isCurrent ? 1 : 0.8,
                  opacity: isCurrent ? 1 : 0.3,
                  zIndex: features.length - Math.abs(offset),
                }}
                animate={{
                  x: offset * 100,
                  scale: isCurrent ? 1 : 0.8,
                  opacity: isCurrent ? 1 : 0.3,
                  zIndex: features.length - Math.abs(offset),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <LiquidGlassCard
                  blurAmount={isCurrent ? 0.1 : 0}
                  saturation={isCurrent ? 130 : 100}
                  className={!isCurrent ? 'border-2 border-white/10' : ''}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 mb-4 shadow-lg">
                      <bgFeature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{bgFeature.title}</h3>
                    <p className="text-slate-300 max-w-xs">{bgFeature.description}</p>
                  </div>
                </LiquidGlassCard>
              </motion.div>
            );
          })}
        </div>
      )
    })),
    {
      key: "start",
      content: (
        <div className="flex flex-col items-center text-center space-y-6">
          <ParallaxIcon>
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-300/50 rounded-full p-6 shadow-2xl relative overflow-hidden"
            >
              <Rocket className="w-16 h-16 text-purple-200 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 to-pink-400/25 animate-pulse"></div>
            </motion.div>
          </ParallaxIcon>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent"
          >
            You're All Set!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-purple-100/90 max-w-md leading-relaxed"
          >
            Ready to dive in and create your first epic night?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="group app-accent-button font-bold text-lg rounded-full px-8 py-6 transition-all duration-300 ease-in-out"
            >
              Let's Go!
              <ArrowRight className="w-5 h-5 ml-2 -mr-2 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      key: 'signup',
      content: <OnboardingSignupCard onSignUp={onComplete} />
    }
  ];

  const changeStep = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentStep(prev => {
      const nextStep = prev + newDirection;
      if (nextStep < 0) return steps.length - 1;
      if (nextStep >= steps.length) return 0;
      return nextStep;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a001a] overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/50 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-900/50 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/50 rounded-full blur-3xl animate-blob"></div>
      </div>
      
      <div className="w-full max-w-2xl h-[500px] flex items-center justify-center relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 w-full max-w-2xl flex justify-between items-center px-8 z-20">
        <Button
          onClick={() => changeStep(-1)}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          aria-label="Previous step"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentStep ? 1 : -1);
                setCurrentStep(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentStep === index ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={() => changeStep(1)}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          aria-label="Next step"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;