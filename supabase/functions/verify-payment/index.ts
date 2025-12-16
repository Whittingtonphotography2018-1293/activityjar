import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseAuth.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    console.log("Verifying payment for session:", session_id);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log("Session status:", session.payment_status);

    if (session.payment_status === "paid") {
      // Check if purchase already exists
      const { data: existingPurchase } = await supabaseClient
        .from("user_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", "unlock_activity_jar")
        .maybeSingle();

      if (!existingPurchase) {
        // Record the purchase
        const { error: insertError } = await supabaseClient
          .from("user_purchases")
          .insert({
            user_id: user.id,
            stripe_customer_id: session.customer as string,
            stripe_payment_id: session.payment_intent as string,
            product_id: "unlock_activity_jar",
            amount: session.amount_total || 99,
            currency: session.currency || "usd",
            status: "completed",
          });

        if (insertError) {
          console.error("Error recording purchase:", insertError);
          throw new Error("Failed to record purchase");
        }

        console.log("Purchase recorded for user:", user.id);
      } else {
        console.log("Purchase already exists for user:", user.id);
      }

      return new Response(JSON.stringify({ success: true, paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: true, paid: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error verifying payment:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
