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
      className="space-y-4"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
        <Button onClick={() => handleOAuthSignIn('google')} disabled={loading} className="w-full bg-white text-gray-900 hover:bg-gray-200 h-12 rounded-lg font-semibold shadow-md flex items-center justify-center">
          <Chrome className="w-5 h-5 mr-3" /> <span>Continue with Google</span>
        </Button>
      </motion.div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/90 px-2 text-slate-400">Or</span></div>
      </div>
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
        <Button onClick={() => setStep('phoneInput')} disabled={loading} variant="secondary" className="w-full bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700 text-white h-12 rounded-lg font-semibold shadow-md flex items-center justify-center">
          <Smartphone className="w-5 h-5 mr-3" /> <span>Continue with Phone</span>
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
      className="space-y-4"
    >
      <h3 className="text-white text-lg font-semibold text-center">Enter Your Phone Number</h3>
      <Input
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
      />
      <Button onClick={handlePhoneSignIn} disabled={loading || !phoneNumber} className="w-full bg-green-500 hover:bg-green-600 h-12">
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
      className="space-y-4 flex flex-col items-center"
    >
      <h3 className="text-white text-lg font-semibold text-center">Enter Verification Code</h3>
      <p className="text-slate-300 text-sm text-center">Sent to {phoneNumber}</p>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
          </InputOTPGroup>
      </InputOTP>
      <Button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="w-full bg-blue-500 hover:bg-blue-600 h-12 mt-4">
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
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl p-8">
          <div className="relative text-center mb-6">
            {(showBackButton || showInternalBackButton) && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button onClick={handleBack} variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-2 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
             <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
            >
              <div className="p-3 bg-slate-800/70 border border-slate-700 rounded-full">
                <PartyPopper className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-extrabold text-white">
              {step === 'select' ? 'Join the Party' : 'Phone Sign-In'}
            </h2>
            <p className="text-slate-400 mt-1">
              {step === 'select' ? "Let's get you signed in." : 'Secure and simple.'}
            </p>
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