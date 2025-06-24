import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { initializeApp } from "https://esm.sh/firebase@9.23.0/app";
import { getAuth } from "https://esm.sh/firebase@9.23.0/auth";

// Initialize Firebase Admin
const firebaseConfig = {
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // Check for POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { idToken } = await req.json();
    
    if (!idToken) {
      return new Response(JSON.stringify({ error: "Missing idToken" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify Firebase token
    try {
      // Verify the Firebase ID token
      const decodedToken = await auth.verifyIdToken(idToken);
      const { uid, phone_number } = decodedToken;

      if (!uid) {
        throw new Error("Invalid Firebase token");
      }

      // Check if user exists in Supabase
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", uid)
        .single();

      let userId;

      if (userError || !existingUser) {
        // Create new user in Supabase Auth
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          phone: phone_number,
          email: `${uid}@firebase.user`, // Placeholder email
          user_metadata: {
            firebase_uid: uid,
            provider: "firebase",
          },
          email_confirm: true,
        });

        if (createError) throw createError;
        userId = newUser.user.id;

        // Insert mapping in users table
        await supabase.from("users").insert({
          id: userId,
          firebase_uid: uid,
          phone: phone_number,
        });
      } else {
        userId = existingUser.id;
      }

      // Generate Supabase JWT token
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
        userId,
        properties: {
          provider: "firebase",
        },
      });

      if (sessionError) throw sessionError;

      return new Response(JSON.stringify({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        user: sessionData.user,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}); 