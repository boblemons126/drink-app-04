
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Users, Wine, Gamepad2, Rocket, PartyPopper, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center text-center p-4"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full p-4 mb-4 shadow-lg">
      <Icon className="w-10 h-10 text-purple-200" />
    </div>
    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
    <p className="text-purple-100/80 max-w-xs">{description}</p>
  </motion.div>
);

const ParallaxIcon = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xTransform = useTransform(x, [-150, 150], [-20, 20]);
  const yTransform = useTransform(y, [-150, 150], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ x: xTransform, y: yTransform, rotateX: yTransform, rotateY: xTransform }}
        className="transition-transform duration-200 ease-out"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

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
    {
      key: "features",
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent"
          >
            What's Inside?
          </motion.h1>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.4
                }
              }
            }}
          >
            <Feature icon={Users} title="Squad Up" description="Create groups, invite friends, and see who's ready to party." />
            <Feature icon={Wine} title="Track the Vibe" description="Keep tabs on drinks and spending for the whole group, in real-time." />
            <Feature icon={Gamepad2} title="Drinking Games" description="Break the ice with fun and interactive drinking games." />
          </motion.div>
        </div>
      )
    },
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
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 hover:from-purple-500 hover:via-pink-400 hover:to-purple-600 text-white h-16 px-12 text-xl font-bold rounded-2xl flex items-center space-x-3 relative overflow-hidden group shadow-2xl border border-purple-300/30 backdrop-blur-sm transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
          </motion.div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen aurora-bg flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="flex-grow flex items-center justify-center w-full relative">
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="w-full max-w-4xl absolute"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -100) {
                nextStep();
              } else if (offset.x > 100) {
                prevStep();
              }
            }}
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-4xl py-8">
        <div className="flex justify-center items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                onClick={() => {
                  setDirection(index > currentStep ? 1 : -1);
                  setCurrentStep(index);
                }}
                className="w-3 h-3 rounded-full cursor-pointer"
                animate={index === currentStep ? { scale: 1.5, backgroundColor: '#FFFFFF' } : { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
