import { User as FirebaseUser } from 'firebase/auth';
import { supabase } from '../supabase/client';

// This function will be called after successful Firebase phone auth
// It will create or update the user in Supabase
export const syncFirebaseUserToSupabase = async (
  firebaseUser: FirebaseUser,
  userData?: { 
    full_name?: string;
    username?: string;
  }
) => {
  try {
    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    // Sign in to Supabase with custom token (Firebase ID token)
    // Note: This requires a Supabase Edge Function to validate the Firebase token
    // and return a Supabase JWT
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token: idToken,
    });
    
    if (error) throw error;
    
    // If we have additional user data and this is a new user, update profile
    if (userData && data.user) {
      // Update user metadata
      await supabase.auth.updateUser({
        data: userData
      });
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      // If no profile exists, create one
      if (!existingProfile && userData.username) {
        await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            username: userData.username,
            full_name: userData.full_name || '',
            phone: firebaseUser.phoneNumber
          }]);
      }
    }
    
    return data.user;
  } catch (error) {
    console.error('Error syncing Firebase user to Supabase:', error);
    throw error;
  }
}; 