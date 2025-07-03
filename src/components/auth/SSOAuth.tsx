import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Chrome, Smartphone, MessageCircle } from 'lucide-react';

interface SSOAuthProps {
  onBack?: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
}

const SSOAuth: React.FC<SSOAuthProps> = ({ onBack, onComplete, showBackButton = false }) => {
  const [loading, setLoading] = useState(false);
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const { toast } = useToast();

  const handleOAuthSignIn = async (provider: 'google' | 'discord') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: `Redirecting to ${provider === 'google' ? 'Google' : 'Discord'}...`,
        description: "Please complete the sign-in process."
      });
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      toast({
        title: "Sign-in Failed",
        description: error.message || `Failed to sign in with ${provider === 'google' ? 'Google' : 'Discord'}. Please try again.`,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  if (showPhoneAuth) {
    const PhoneOnlyAuth = require('./PhoneOnlyAuth').default;
    return (
      <PhoneOnlyAuth 
        onBack={() => setShowPhoneAuth(false)}
        onComplete={onComplete}
        showBackButton={true}
      />
    );
  }

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
              Sign In to Continue
            </CardTitle>
            
            <CardDescription className="text-slate-300">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center space-x-2 h-12"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>

            {/* Discord Sign In */}
            <Button
              onClick={() => handleOAuthSignIn('discord')}
              disabled={loading}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center space-x-2 h-12"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Continue with Discord</span>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-slate-400">Or</span>
              </div>
            </div>

            {/* Phone Sign In */}
            <Button
              onClick={() => setShowPhoneAuth(true)}
              disabled={loading}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2 h-12"
            >
              <Smartphone className="w-5 h-5" />
              <span>Continue with Phone</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SSOAuth; 