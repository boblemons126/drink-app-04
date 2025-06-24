import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Smartphone, Apple } from 'lucide-react';

interface PhoneAuthProps {
  onBack: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onBack, onComplete, showBackButton = true }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = `+1${cleanPhone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setStep('otp');
      toast({
        title: "Code Sent!",
        description: "Check your phone for the verification code."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = `+1${cleanPhone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Check if this is a new user
      if (data.user && !data.user.user_metadata?.full_name && isSignUp) {
        setStep('profile');
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully."
        });
        onComplete?.();
      }
    } catch (error: any) {
      toast({
        title: "Invalid Code",
        description: "Please check the code and try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username) return;

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            username: username
          }
        });

        if (updateError) throw updateError;

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.user.id,
            username,
            full_name: fullName
          }]);

        if (profileError) throw profileError;

        toast({
          title: "Profile Created!",
          description: "Welcome to DRNKUP! Let's get the party started."
        });
        
        onComplete?.();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSocialAuth = async (provider: 'apple' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="absolute top-4 left-4 text-white hover:bg-white/10 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              DRNKUP
            </div>
            
            <CardTitle className="text-white">
              {step === 'phone' && 'Enter Your Phone Number'}
              {step === 'otp' && 'Verify Your Number'}
              {step === 'profile' && 'Complete Your Profile'}
            </CardTitle>
            
            <CardDescription className="text-slate-300">
              {step === 'phone' && 'We\'ll send you a verification code'}
              {step === 'otp' && `We sent a code to ${phone}`}
              {step === 'profile' && 'Tell us a bit about yourself'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'phone' && (
              <>
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="123-456-7890"
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                        className="bg-white/10 border-white/20 text-white placeholder-slate-400 pl-12"
                        maxLength={12}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    disabled={loading || !phone}
                  >
                    {loading ? "Sending..." : "Send Code"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('apple')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    Apple
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('google')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'New to DRNKUP? Sign up'}
                  </button>
                </div>
              </>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white text-center block">Enter Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('phone')}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  Resend Code
                </Button>
              </form>
            )}

            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  disabled={loading || !fullName || !username}
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-400 mt-6">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
