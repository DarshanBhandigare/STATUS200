import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/context/ToastContext';
import { loadRazorpayScript } from '@/lib/razorpay';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const readJsonResponse = async (response: Response) => {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { raw: text };
    }
  };

  const handleUpgradeToPro = async () => {
    if (!user) {
      toastError('Sign in required', 'Create an account or sign in before upgrading to Pro.');
      navigate('/login');
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

    if (!keyId) {
      toastError('Payment unavailable', 'Razorpay key is missing from environment.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const sessionResult = supabase ? await supabase.auth.getSession() : null;
      const accessToken = sessionResult?.data.session?.access_token;
      if (!accessToken) {
        toastError('Sign in required', 'Your session expired. Please sign in again.');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError('Payment unavailable', 'Could not load Razorpay checkout.');
        return;
      }

      if (!window.Razorpay) {
        toastError('Payment unavailable', 'Razorpay checkout did not initialize.');
        return;
      }

      const createOrderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: 5000,
          currency: 'INR',
          receipt: `status200_pro_${Date.now()}`,
        }),
      });

      const createOrderData = await readJsonResponse(createOrderResponse);

      if (!createOrderResponse.ok) {
        const message =
          (createOrderData && typeof createOrderData.error === 'string' && createOrderData.error) ||
          (createOrderData && typeof createOrderData.raw === 'string' && createOrderData.raw) ||
          `Could not create payment order (HTTP ${createOrderResponse.status}).`;
        if (createOrderResponse.status === 401) {
          toastError('Payment setup error', message);
        } else {
          toastError('Payment failed', message);
        }
        return;
      }

      if (
        !createOrderData ||
        typeof createOrderData.order_id !== 'string' ||
        typeof createOrderData.amount !== 'number' ||
        typeof createOrderData.currency !== 'string'
      ) {
        toastError('Payment failed', 'Order creation response was incomplete.');
        return;
      }

      const options: RazorpayOptions = {
        key: keyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        name: 'Status-200',
        description: 'Pro Graduate Plan',
        order_id: createOrderData.order_id,
        prefill: {
          name: 'Status-200 User',
          email: '',
          contact: '',
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: () => {
            info('Payment cancelled', 'Checkout was closed before payment.');
          },
        },
        retry: {
          enabled: false,
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(response),
            });

            const verifyData = await readJsonResponse(verifyResponse);

            if (!verifyResponse.ok) {
              const verifyMessage =
                (verifyData && typeof verifyData.error === 'string' && verifyData.error) ||
                (verifyData && typeof verifyData.raw === 'string' && verifyData.raw) ||
                'Signature mismatch.';
              toastError('Payment verification failed', verifyMessage);
              return;
            }

            success('Payment successful', 'Your Pro upgrade payment is verified.');
          } catch (verifyError) {
            console.error('Payment verify error:', verifyError);
            toastError('Payment verification failed', 'Could not verify payment.');
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        toastError(
          'Payment failed',
          response?.error?.description || response?.error?.reason || 'Payment was not completed.'
        );
      });
      razorpay.open();
    } catch (error) {
      console.error('Razorpay checkout error:', error);
      toastError('Payment failed', 'Something went wrong while opening checkout.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/40 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Start free, upgrade as your career scales.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Everything students and early-career engineers need to get hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="default" size="sm">
                  Student Starter
                </Badge>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Free Forever
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ideal for students applying for internships and fresh graduate roles.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">
                  Rs. 0
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ forever free</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Includes:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>1 Active published portfolio</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Core templates (Minimal, Modern, Professional)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>
                      Public shareable URL (<code className="text-emerald-600 dark:text-emerald-400">/p/slug</code>)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Live real-time editor preview</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Resume PDF attachment hosting</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Automatic random slug for your public URL</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                Get Started Free
              </Button>
              <p className="mt-3 text-[11px] text-center text-slate-500 dark:text-slate-400">
                No credit card required. Upgrade later only if you want a custom slug and premium features.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900/90 border-2 border-emerald-500/40 p-8 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="success" size="sm">
                  Pro Graduate
                </Badge>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Custom URL Slug
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Choose a memorable public URL for your portfolio and share it everywhere.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">
                  Rs. 50
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ one-time payment</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Everything in Free, plus:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Choose your own slug (<code className="text-emerald-600 dark:text-emerald-400">/p/your-name</code>)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Remove Status-200 branding badge</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Advanced visitor & recruiter analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Password-protected portfolio option</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Priority student support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="primary"
                size="md"
                onClick={handleUpgradeToPro}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full shadow-glow"
                isLoading={isProcessingPayment}
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Upgrade to Pro
                </span>
              </Button>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>No subscription</span>
                <span>Secure Razorpay checkout</span>
                <span>One-time payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
