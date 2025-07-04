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
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Button 
          onClick={() => handleOAuthSignIn('google')} 
          disabled={loading} 
          className="w-full glass-button h-14 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3 border border-white/20"
        >
          <Chrome className="w-6 h-6" /> 
          <span>Continue with Google</span>
        </Button>
      </motion.div>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/30" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-transparent px-4 text-white/70 font-medium">Or</span>
        </div>
      </div>
      
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
        whileHover={{ scale: 1.02 }} 
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Button 
          onClick={() => setStep('phoneInput')} 
          disabled={loading} 
          className="w-full glass-button-outline h-14 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3"
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
      className="space-y-6"
    >
      <h3 className="text-white text-xl font-semibold text-center">Enter Your Phone Number</h3>
      <Input
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="glass-input h-14 text-lg rounded-2xl border border-white/20"
      />
      <Button 
        onClick={handlePhoneSignIn} 
        disabled={loading || !phoneNumber} 
        className="w-full glass-button h-14 rounded-2xl font-semibold text-lg"
      >
        Send Code
      </Button>
    </motion.div>
  );

  const renderOtpInput = () => (
    <motion.div
      key="otpInput"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6 flex flex-col items-center"
    >
      <h3 className="text-white text-xl font-semibold text-center">Enter Verification Code</h3>
      <p className="text-white/70 text-base text-center">Sent to {phoneNumber}</p>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup className="gap-3">
          <InputOTPSlot index={0} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
          <InputOTPSlot index={1} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
          <InputOTPSlot index={2} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
          <InputOTPSlot index={3} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
          <InputOTPSlot index={4} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
          <InputOTPSlot index={5} className="glass-input w-14 h-14 text-xl rounded-xl border border-white/20" />
        </InputOTPGroup>
      </InputOTP>
      <Button 
        onClick={handleVerifyOtp} 
        disabled={loading || otp.length < 6} 
        className="w-full glass-button h-14 rounded-2xl font-semibold text-lg mt-6"
      >
        Verify
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
    <div className="min-h-screen sunset-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="relative text-center mb-8">
            {(showBackButton || showInternalBackButton) && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  onClick={handleBack} 
                  variant="ghost" 
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-3 rounded-full"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
            
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            >
              <div className="p-4 glass-icon rounded-full border border-white/20">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-extrabold text-white mb-2"
            >
              Welcome to DRNKUP
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-base"
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