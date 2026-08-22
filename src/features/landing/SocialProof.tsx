import React from 'react';
import { GraduationCap, Zap, Smartphone, ShieldCheck } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const highlights = [
    {
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      title: 'Built for Students & Juniors',
      description: 'Structured to highlight coursework, academic projects, internships, and self-taught codebases.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: '3-Minute Setup',
      description: 'No complicated config or deployment pipelines. Enter details and get published instantly.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-400" />,
      title: 'Mobile & Recruiter Ready',
      description: "Engineered to load fast and look polished on recruiters' phones, laptops, and tablets.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      title: 'Clean Shareable URL',
      description: 'Get a public link like status-200.vercel.app/p/yourname that you can paste directly on resumes.',
    },
  ];

  return (
    <section className="border-y border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
