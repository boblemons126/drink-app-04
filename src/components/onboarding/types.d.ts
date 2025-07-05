import { LucideIcon } from 'lucide-react';

declare module '@/components/onboarding/ParallaxIcon' {
  export interface ParallaxIconProps {
    children: React.ReactNode;
  }
  
  export const ParallaxIcon: React.FC<ParallaxIconProps>;
}

declare module '@/components/onboarding/Feature' {
  export interface FeatureProps {
    icon: LucideIcon;
    title: string;
    description: string;
  }
  
  export const Feature: React.FC<FeatureProps>;
}

declare module '@/components/onboarding/OnboardingSignupCard' {
  export interface OnboardingSignupCardProps {
    onSignUp: () => void;
  }
  
  export default function OnboardingSignupCard(props: OnboardingSignupCardProps): JSX.Element;
}

declare module '@/components/onboarding/OnboardingAuth' {
  export interface OnboardingAuthProps {
    onComplete: () => void;
    onBack?: () => void;
  }
  
  export default function OnboardingAuth(props: OnboardingAuthProps): JSX.Element;
} 