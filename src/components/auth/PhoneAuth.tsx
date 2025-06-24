import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseClient, useAuthSync } from '@/hooks';
import { getFirebaseApp } from '@/integrations/firebase/client';
import { RecaptchaVerifier } from 'firebase/auth';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-auth';

interface PhoneAuthProps {
  onBack: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(30, { message: "Username must not be longer than 30 characters." }),
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50, { message: "Full name must not be longer than 50 characters." }),
});

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onBack, onComplete, showBackButton = true, children }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { sendVerificationCode, verifyCode } = useFirebaseClient();
  const { syncFirebaseUserToSupabase } = useAuthSync();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input_phone"); // input_phone, verify_otp, create_profile
  const [recaptchaResolved, setRecaptchaResolved] = useState(false);

  const app = getFirebaseApp();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
    },
  });

  useEffect(() => {
    if (step === "input_phone" && !recaptchaResolved) {
      window.recaptchaVerifier = new RecaptchaVerifier(app, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          setRecaptchaResolved(true);
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setRecaptchaResolved(false);
        },
      });
      window.recaptchaVerifier.render();
    }
  }, [step, recaptchaResolved, app]);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;
      const result = await sendVerificationCode(fullPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep("verify_otp");
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone.",
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const userCredential = await verifyCode(confirmationResult, otp);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        await syncFirebaseUserToSupabase(firebaseUser);
        setStep("create_profile");
        toast({
          title: "Verification Successful",
          description: "Phone number verified. Please create your profile.",
        });
      } else {
        throw new Error("Firebase user not found after verification.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (values: z.infer<typeof profileFormSchema>) => {
    setLoading(true);
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is expected for new users
        throw fetchError;
      }

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update({ username: values.username, full_name: values.full_name })
          .eq("id", user?.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase.from("profiles").insert({
          id: user?.id,
          username: values.username,
          full_name: values.full_name,
        });

        if (error) throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      // Redirect or navigate after successful profile creation/update
      // For now, let's just log and assume success
      console.log("Profile created/updated successfully!");
    } catch (error: any) {
      console.error("Error creating/updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create/update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {step === "input_phone" && "Enter Phone Number"}
              {step === "verify_otp" && "Verify OTP"}
              {step === "create_profile" && "Create Profile"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "input_phone" && "Please enter your phone number to continue."}
              {step === "verify_otp" && "Please enter the 6-digit code sent to your phone."}
              {step === "create_profile" && "Welcome! Please complete your profile."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "input_phone" && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (USA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      {/* Add more country codes as needed */}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div id="recaptcha-container"></div>
                <Button onClick={handleSendOtp} className="w-full" disabled={loading || !recaptchaResolved}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            )}

            {step === "verify_otp" && (
              <div className="space-y-4">
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <Button onClick={handleVerifyOtp} className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button variant="link" onClick={() => setStep("input_phone")} disabled={loading}>
                  Edit Phone Number
                </Button>
              </div>
            )}

            {step === "create_profile" && (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleCreateProfile)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormDescription>This will be your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>Your full name for our records.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};

export default PhoneAuth;