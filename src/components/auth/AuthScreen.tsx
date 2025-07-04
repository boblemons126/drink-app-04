import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Chrome, Smartphone, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const AuthScreen = ({ onBack, onComplete, showBackButton }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // 'select', 'phoneInput', 'otpInput'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast({ title: "Sign-in Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } else {
      setStep('otpInput');
      toast({ title: "OTP Sent", description: "Check your phone for the verification code." });
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      toast({ title: "OTP Verification Failed", description: error.message, variant: "destructive" });
    } else if (data.session) {
      onComplete();
    }
  };

  const renderSelect = () => (
    <motion.div
      key="select"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Button 
          onClick={() => handleOAuthSignIn('google')} 
          disabled={loading} 
          className="w-full app-primary-button h-16 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3"
        >
          <Chrome className="w-6 h-6" /> 
          <span>Continue with Google</span>
        </Button>
      </motion.div>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/30" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-transparent px-4 text-white/70 font-medium tracking-wider">Or</span>
        </div>
      </div>
      
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Button 
          onClick={() => setStep('phoneInput')} 
          disabled={loading} 
          className="w-full app-secondary-button h-16 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3"
        >
          <Smartphone className="w-6 h-6" /> 
          <span>Continue with Phone</span>
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderPhoneInput = () => (
    <motion.div
      key="phoneInput"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Enter Your Phone Number</h3>
        <p className="text-white/70 text-sm">We'll send you a verification code</p>
      </div>
      <Input
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mobile-glass-input h-16 text-lg rounded-2xl text-center"
      />
      <Button 
        onClick={handlePhoneSignIn} 
        disabled={loading || !phoneNumber} 
        className="w-full app-accent-button h-16 rounded-2xl font-semibold text-lg"
      >
        {loading ? "Sending..." : "Send Code"}
      </Button>
    </motion.div>
  );

  const renderOtpInput = () => (
    <motion.div
      key="otpInput"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-8 flex flex-col items-center"
    >
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Enter Verification Code</h3>
        <p className="text-white/70 text-sm">Sent to {phoneNumber}</p>
      </div>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup className="gap-3">
          <InputOTPSlot index={0} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
          <InputOTPSlot index={1} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
          <InputOTPSlot index={2} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
          <InputOTPSlot index={3} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
          <InputOTPSlot index={4} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
          <InputOTPSlot index={5} className="mobile-glass-input w-14 h-16 text-xl rounded-xl" />
        </InputOTPGroup>
      </InputOTP>
      <Button 
        onClick={handleVerifyOtp} 
        disabled={loading || otp.length < 6} 
        className="w-full app-success-button h-16 rounded-2xl font-semibold text-lg"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </motion.div>
  );

  const handleBack = () => {
    if (step === 'otpInput') setStep('phoneInput');
    else if (step === 'phoneInput') setStep('select');
    else onBack();
  };

  const showInternalBackButton = step === 'phoneInput' || step === 'otpInput';

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background orbs matching onboarding */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mobile-glass-card rounded-3xl p-8 mx-4">
          <div className="relative text-center mb-8">
            {(showBackButton || showInternalBackButton) && (
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <Button 
                  onClick={handleBack} 
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
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="p-4 mobile-glass-icon rounded-full">
                <PartyPopper className="w-10 h-10 text-purple-300" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-extrabold text-white mb-2"
            >
              Welcome to DRNKUP
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-base leading-relaxed"
            >
              {step === 'select' ? "Your ultimate party companion awaits" : 
               step === 'phoneInput' ? 'Secure and simple sign-in' : 
               'Almost there!'}
            </motion.p>
          </div>
          
          <AnimatePresence mode="wait">
            {step === 'select' && renderSelect()}
            {step === 'phoneInput' && renderPhoneInput()}
            {step === 'otpInput' && renderOtpInput()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;