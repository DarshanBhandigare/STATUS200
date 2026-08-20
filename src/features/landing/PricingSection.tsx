import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Start free, upgrade as your career scales.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Everything students and early-career engineers need to get hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between shadow-subtle hover:border-slate-700 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="default" size="sm">
                  Student Starter
                </Badge>
                <h3 className="text-2xl font-display font-bold text-white">Free Forever</h3>
                <p className="text-xs text-slate-400">
                  Ideal for students applying for internships and fresh graduate roles.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400">/ forever free</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <p className="font-semibold text-slate-200">Includes:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Active published portfolio</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Core templates (Minimal, Modern, Professional)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Public shareable URL (<code className="text-emerald-400">/p/slug</code>)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All core sections (Projects, Skills, Education, Experience)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Mobile-responsive recruiter view</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/signup')}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Pro Tier (Marked as future/coming soon) */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/30 p-8 flex flex-col justify-between shadow-glow relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="purple" size="sm">
                  Pro Developer
                </Badge>
                <h3 className="text-2xl font-display font-bold text-white">Status 200 Pro</h3>
                <p className="text-xs text-slate-400">
                  For freelancers and developers managing multiple customized profiles.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-white">$6</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <p className="font-semibold text-slate-200">Everything in Free plus:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited portfolios & workspaces</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Premium boutique designer templates</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom domain binding (<code className="text-emerald-400">yourname.dev</code>)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI resume & project description assistant</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Detailed recruiter view & visitor analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="md"
                disabled
                className="w-full opacity-75 cursor-not-allowed"
              >
                Pro Plan (Launching Soon)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
