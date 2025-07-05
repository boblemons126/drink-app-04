
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Chrome, Smartphone, PartyPopper, Apple, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

const SSOAuth = ({ onBack, onComplete, showBackButton }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('sso'); // 'sso', 'profile'
  const [profileData, setProfileData] = useState({ username: '', fullName: '' });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && step === 'sso') {
      // Check if user needs to complete profile
      if (!user.user_metadata?.username) {
        setStep('profile');
      } else {
        onComplete();
      }
    }
  }, [user, step, onComplete]);

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });
    if (error) {
      toast({ title: "Sign-in Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handleProfileSetup = async () => {
    if (!profileData.username.trim()) {
      toast({ title: "Username Required", description: "Please enter a username", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        username: profileData.username,
        full_name: profileData.fullName || null,
      }
    });

    if (error) {
      toast({ title: "Profile Setup Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome!", description: "Your account is ready to go", variant: "default" });
      onComplete();
    }
    setLoading(false);
  };

  const renderSSO = () => (
    <motion.div
      key="sso"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center space-x-2 text-white/90">
          <Shield className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium tracking-wide">Secure & Fast</span>
        </div>
        <p className="text-white/70 text-sm max-w-sm mx-auto leading-relaxed">
          Choose your preferred sign-in method. Your account will sync across all devices.
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Button 
            onClick={() => handleOAuthSignIn('google')} 
            disabled={loading} 
            className="w-full app-primary-button h-16 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Chrome className="w-6 h-6 relative z-10" /> 
            <span className="relative z-10">Continue with Google</span>
            <Zap className="w-4 h-4 opacity-70 relative z-10" />
          </Button>
        </motion.div>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-4 text-white/50 font-medium tracking-widest">Or</span>
          </div>
        </div>
        
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Button 
            onClick={() => handleOAuthSignIn('apple')} 
            disabled={loading} 
            className="w-full app-secondary-button h-16 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Apple className="w-6 h-6 relative z-10" /> 
            <span className="relative z-10">Continue with Apple</span>
            <Zap className="w-4 h-4 opacity-70 relative z-10" />
          </Button>
        </motion.div>
      </div>

      <motion.div 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="text-center pt-2"
      >
        <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mobile-glass-icon rounded-full p-4 w-20 h-20 mx-auto mb-4 relative overflow-hidden"
        >
          <PartyPopper className="w-12 h-12 text-purple-300 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
        </motion.div>
        <h3 className="text-white text-2xl font-bold mb-2">Almost Ready!</h3>
        <p className="text-white/70 text-sm max-w-sm mx-auto">
          Let's set up your profile so your friends can find you
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium block">Username *</label>
          <Input
            type="text"
            placeholder="@yourname"
            value={profileData.username}
            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            className="mobile-glass-input h-14 text-lg rounded-xl"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium block">Display Name</label>
          <Input
            type="text"
            placeholder="Your full name (optional)"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className="mobile-glass-input h-14 text-lg rounded-xl"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleProfileSetup} 
        disabled={loading || !profileData.username.trim()} 
        className="w-full app-success-button h-16 rounded-2xl font-semibold text-lg relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <span className="relative z-10">
          {loading ? "Setting up..." : "Complete Setup"}
        </span>
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced floating background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/25 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mobile-glass-card rounded-3xl p-8 mx-4 relative overflow-hidden">
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400 to-transparent rounded-full blur-xl"></div>
          </div>

          <div className="relative text-center mb-8">
            {showBackButton && (
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <Button 
                  onClick={onBack} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 p-3 rounded-full transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
            
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="mobile-glass-icon rounded-full p-4 relative overflow-hidden">
                <PartyPopper className="w-10 h-10 text-purple-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 animate-pulse"></div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-extrabold text-white mb-2"
            >
              {step === 'sso' ? 'Join DRNKUP' : 'Setup Profile'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-base leading-relaxed"
            >
              {step === 'sso' ? 'Your party companion awaits' : 'Just one more step'}
            </motion.p>
          </div>
          
          <AnimatePresence mode="wait">
            {step === 'sso' && renderSSO()}
            {step === 'profile' && renderProfile()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SSOAuth;
