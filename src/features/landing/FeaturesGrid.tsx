import React from 'react';
import {
  Wand2,
  LayoutTemplate,
  Eye,
  Sliders,
  Share2,
  Smartphone,
} from 'lucide-react';
import { Card } from '@/components/common/Card';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Wand2 className="w-5 h-5 text-emerald-400" />,
      title: 'Easy Portfolio Builder',
      description:
        'Fill in simple, guided forms for your bio, education, tech stack, and projects. No Markdown quirks or CSS debugging.',
    },
    {
      icon: <LayoutTemplate className="w-5 h-5 text-indigo-400" />,
      title: 'Distinct Professional Templates',
      description:
        'Switch between minimalist developer, modern visual, and executive recruiter styles with a single click without re-typing data.',
    },
    {
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      title: 'Real-Time Live Preview',
      description:
        'Watch your portfolio update instantaneously as you type. See exactly what hiring managers and recruiters see before publishing.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-amber-400" />,
      title: 'Custom Modular Sections',
      description:
        'Tailor your portfolio with certifications, hackathon achievements, university course highlights, and resume downloads.',
    },
    {
      icon: <Share2 className="w-5 h-5 text-rose-400" />,
      title: 'Custom Shareable URL',
      description:
        'Claim your unique URL like status200.dev/p/your-slug. Share it in your LinkedIn bio, email signature, and job applications.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-teal-400" />,
      title: 'Recruiter-Optimized & Fast',
      description:
        'Optimized for rapid mobile loading and screen-reader accessibility so technical recruiters never hit a blank screen.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Features & Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Everything you need to impress hiring teams.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Purpose-built to solve the common pitfalls of student developer portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <Card
              key={idx}
              hoverEffect
              className="flex flex-col justify-between space-y-4 p-6 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 font-display">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
