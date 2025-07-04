import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: 'Successfully Signed In',
          description: 'Welcome back!',
        });
        navigate('/'); // Redirect to home page or dashboard
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth'); // Redirect to login page on sign out
      }
    });

    // Check for session on initial load
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            navigate('/');
        }
    }
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen aurora-bg flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      <p className="mt-4 text-lg">Finalizing your authentication...</p>
      <p className="text-sm text-slate-300">Please wait a moment.</p>
    </div>
  );
};

export default AuthCallback; 