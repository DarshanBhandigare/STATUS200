import React from 'react';
import { UserCheck, Palette, Rocket } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Enter Your Information',
      description:
        'Input your bio, college coursework, technical skills, GitHub projects, and work or hackathon experience in simple, structured fields.',
    },
    {
      step: '02',
      icon: <Palette className="w-6 h-6 text-indigo-400" />,
      title: 'Choose & Customize Template',
      description:
        'Select from curated, recruiter-approved layouts. Toggle accent colors and font styles with instant live side-by-side preview.',
    },
    {
      step: '03',
      icon: <Rocket className="w-6 h-6 text-sky-400" />,
      title: 'Publish & Share Everywhere',
      description:
        'Hit publish to get your personal vanity URL (e.g. status-200.vercel.app/p/alex). Add it to your resume header, LinkedIn profile, and job forms.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            From blank canvas to published portfolio in minutes.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Stop wasting weekends wrestling with CSS templates. Focus on building great software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-300 dark:text-slate-700">{item.step}</span>
                </div>

                <h3 className="text-lg font-semibold font-display text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
