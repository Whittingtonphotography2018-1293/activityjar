import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const { user, hasPurchased, signOut, refreshPurchaseStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already purchased, redirect to main app
  if (hasPurchased === true) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment');

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Navigate directly to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Unable to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchase = async () => {
    setRestoring(true);
    try {
      await refreshPurchaseStatus();
      // Small delay to allow state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: 'Purchase Check Complete',
        description: hasPurchased ? 'Your purchase has been restored!' : 'No previous purchase found.',
      });
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: 'Restore Failed',
        description: 'Unable to check purchase status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRestoring(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Activity Jar" className="h-20 w-auto" />
        </div>

        {/* Payment Card */}
        <div className="bg-card rounded-3xl shadow-card p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Unlock Activity Jar
            </h1>
            <p className="text-muted-foreground">
              Get unlimited access to AI-powered activity ideas for your kids!
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-foreground">$0.99</span>
            <span className="text-muted-foreground ml-2">one-time</span>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              'Unlimited AI activity suggestions',
              'Save your favorite activities',
              'Filter by age, location & time',
              'Shake to discover new ideas',
              'Lifetime access',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary-foreground" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || restoring}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Unlock Now'
            )}
          </Button>

          {/* Restore Purchase Button */}
          <Button
            onClick={handleRestorePurchase}
            disabled={loading || restoring}
            variant="ghost"
            className="w-full mt-3 text-muted-foreground hover:text-foreground"
          >
            {restoring ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-2" />
            )}
            Restore Purchase
          </Button>

          {/* User info */}
          {user && (
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Signed in as {user.email}
              </p>
              <button
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Security note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          🔒 Secure payment powered by Stripe
        </p>
      </motion.div>
    </div>
  );
};

export default Payment;
