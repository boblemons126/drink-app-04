import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (!profile) {
            // Create profile for new OAuth users
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert([{
                id: data.session.user.id,
                username: data.session.user.email?.split('@')[0] || `user${Math.floor(Math.random() * 1000)}`,
                full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || 'Anonymous',
                email: data.session.user.email
              }]);

            if (profileError) {
              console.error('Profile creation error:', profileError);
            }
          }

          toast({
            title: "Welcome to DRNKUP!",
            description: "You've been signed in successfully."
          });

          navigate('/');
        } else {
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to complete sign-in. Please try again.",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          DRNKUP
        </div>
        <div className="text-white">Completing sign-in...</div>
      </div>
    </div>
  );
};

export default AuthCallback; 