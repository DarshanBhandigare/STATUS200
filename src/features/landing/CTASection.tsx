import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Ready in under 3 minutes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
          Ready to showcase your engineering journey?
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Join hundreds of students and developers creating modern, recruiter-ready portfolios today.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/signup')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-glow"
          >
            Create My Portfolio Free
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto"
          >
            Sign In to Existing Portfolio
          </Button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>No credit card required. Free forever.</span>
        </div>
      </div>
    </section>
  );
};
