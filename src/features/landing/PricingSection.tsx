import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/40 transition-colors">
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
          {/* Free Tier */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="default" size="sm">
                  Student Starter
                </Badge>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Free Forever</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ideal for students applying for internships and fresh graduate roles.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">$0</span>
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
                    <span>Public shareable URL (<code className="text-emerald-600 dark:text-emerald-400">/p/slug</code>)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Live real-time editor preview</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Resume PDF attachment hosting</span>
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
            </div>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900/90 border-2 border-emerald-500/40 p-8 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="success" size="sm">
                  Pro Graduate
                </Badge>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Custom Domain</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  For seniors and freelancers who want personal branding on custom domains.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">$4</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month, billed yearly</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Everything in Free, plus:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Connect custom domain (yourname.dev)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Remove Status 200 branding badge</span>
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
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full shadow-glow"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
