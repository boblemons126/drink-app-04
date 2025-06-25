
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Smartphone, User } from 'lucide-react';

interface PhoneOnlyAuthProps {
  onBack?: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
}

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

const PhoneOnlyAuth: React.FC<PhoneOnlyAuthProps> = ({ onBack, onComplete, showBackButton = false }) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (countryCode === '+1') {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
    return numbers;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${countryCode}${cleanPhone}`;

      console.log('Sending OTP to:', fullPhoneNumber);

      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) throw error;

      setStep('otp');
      toast({
        title: "Code Sent!",
        description: "Check your phone for the verification code."
      });
    } catch (error: any) {
      console.error('Phone auth error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please check your phone number.",
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
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${countryCode}${cleanPhone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      if (data.user && !data.user.user_metadata?.full_name) {
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
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            username: username
          }
        });

        if (updateError) throw updateError;

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            id: user.user.id,
            username,
            full_name: fullName
          }]);

        if (profileError) throw profileError;

        toast({
          title: "Welcome to DRNKUP!",
          description: "Your profile has been created. Let's get the party started!"
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
              {step === 'otp' && `We sent a code to ${countryCode} ${phoneNumber}`}
              {step === 'profile' && 'Tell us a bit about yourself'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white">Country</Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                      {countryCodes.map((country) => (
                        <SelectItem 
                          key={country.code} 
                          value={country.code}
                          className="text-white hover:bg-slate-700"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-slate-400">{country.country}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <div className="flex space-x-2">
                    <div className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white font-medium min-w-fit">
                      {countryCode}
                    </div>
                    <div className="relative flex-1">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        className="bg-white/10 border-white/20 text-white placeholder-slate-400 pl-12"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  disabled={loading || !phoneNumber.trim()}
                >
                  {loading ? "Sending..." : "Send Code"}
                </Button>
              </form>
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
                  Change Phone Number
                </Button>
              </form>
            )}

            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-slate-400 pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">@</span>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="bg-white/10 border-white/20 text-white placeholder-slate-400 pl-8"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Only lowercase letters, numbers, and underscores allowed
                  </p>
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

export default PhoneOnlyAuth;
