import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { refreshPurchaseStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId },
        });

        if (error) {
          console.error('Verification error:', error);
        } else if (data?.paid) {
          setVerified(true);
          refreshPurchaseStatus();
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, refreshPurchaseStatus]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Activity Jar" className="h-20 w-auto" />
        </div>

        {verifying ? (
          <div className="bg-card rounded-3xl shadow-card p-8">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">
              Verifying Payment...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your purchase.
            </p>
          </div>
        ) : verified ? (
          <div className="bg-card rounded-3xl shadow-card p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for unlocking Activity Jar! You now have lifetime access to unlimited activity ideas.
            </p>
            <Button
              onClick={handleContinue}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Start Exploring Activities
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-3xl shadow-card p-8">
            <h1 className="text-xl font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your payment. Please contact support if you were charged.
            </p>
            <Button
              onClick={() => navigate('/payment')}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
