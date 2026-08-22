import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Seo } from '@/components/common/Seo';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center selection:bg-emerald-500 selection:text-slate-950">
      <Seo
        title="404 - Page Not Found"
        description="The page you were looking for does not exist on Status 200."
        canonicalPath="/404"
        noindex
      />
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-6 shadow-glow">
        <Sparkles className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
        404 - Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-2">
        We couldn't find that page
      </h1>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The portfolio or link you are looking for might have been unpublished, moved, or does not exist.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          leftIcon={<Home className="w-4 h-4" />}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};
