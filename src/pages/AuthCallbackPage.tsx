import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

/**
 * AuthCallbackPage
 * Supabase redirects here after Google OAuth.
 * The SDK auto-parses the #access_token hash, fires onAuthStateChange,
 * and then we navigate to the dashboard.
 */
export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Give Supabase a moment to process the OAuth response from the URL hash
    if (!supabase) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        subscription.unsubscribe();
        navigate('/login', { replace: true });
      }
    });

    // Safety timeout: redirect to dashboard after 5s regardless
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      navigate('/dashboard', { replace: true });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
        <Sparkles className="w-6 h-6 text-slate-950 stroke-[2.5]" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse">Signing you in…</p>
    </div>
  );
};
