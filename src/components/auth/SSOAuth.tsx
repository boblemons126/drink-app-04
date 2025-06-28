
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Apple } from 'lucide-react';

interface SSOAuthProps {
  onBack: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
}

const SSOAuth: React.FC<SSOAuthProps> = ({ onBack, onComplete, showBackButton = true }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'auth' | 'profile'>('auth');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
      
      // Social auth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error('Social auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to sign in with ${provider}. Please try again.`,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: fullName.trim(),
            username: username.trim()
          }
        });

        if (updateError) throw updateError;

        // Create profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            id: user.user.id,
            username: username.trim(),
            full_name: fullName.trim()
          }]);

        if (profileError) throw profileError;

        toast({
          title: "Welcome to DRNKUP!",
          description: "Your profile has been created. Let's get the party started!"
        });
        
        onComplete?.();
      }
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast({
        title: "Profile Creation Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const formatUsername = (value: string) => {
    return value.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  // Check if we need to show profile setup for existing authenticated users
  React.useEffect(() => {
    const checkUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.user_metadata?.full_name) {
        setStep('profile');
      }
    };
    
    checkUserProfile();
  }, []);

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                DRNKUP
              </div>
              <CardTitle className="text-white">Complete Your Profile</CardTitle>
              <CardDescription className="text-slate-300">
                Tell us a bit about yourself to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                      onChange={(e) => setUsername(formatUsername(e.target.value))}
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
                  disabled={loading || !fullName.trim() || !username.trim()}
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
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
            
            <CardTitle className="text-white">Join the Party</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in with your preferred method to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Options */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 h-14 text-lg"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button
                onClick={() => handleSocialAuth('apple')}
                disabled={loading}
                className="bg-black border border-white/20 text-white hover:bg-gray-900 h-14 text-lg"
              >
                <Apple className="w-6 h-6 mr-3" />
                Continue with Apple
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="ml-2 text-white text-sm">Signing you in...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SSOAuth;
