// Export all hooks from this directory
export { useToast } from './use-toast';
export { useAuth, useUser } from './use-auth';

// Firebase hooks
export const useFirebaseClient = () => {
  const { sendVerificationCode, verifyCode } = require('../integrations/firebase/client');
  return { sendVerificationCode, verifyCode };
};

export const useAuthSync = () => {
  const { syncFirebaseUserToSupabase } = require('../integrations/firebase/auth-sync');
  return { syncFirebaseUserToSupabase };
};