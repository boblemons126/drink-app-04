import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, Auth, ConfirmationResult } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

// Helper function to create a RecaptchaVerifier
export const createRecaptchaVerifier = (
  containerId: string, 
  auth: Auth = firebaseAuth,
  size: 'invisible' | 'normal' = 'invisible'
) => {
  return new RecaptchaVerifier(auth, containerId, {
    size,
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
};

// Send verification code
export const sendVerificationCode = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      phoneNumber,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error('Error sending code:', error);
    throw error;
  }
};

// Verify code and sign in
export const verifyCode = async (
  confirmationResult: ConfirmationResult,
  verificationCode: string
) => {
  try {
    return await confirmationResult.confirm(verificationCode);
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
}; 