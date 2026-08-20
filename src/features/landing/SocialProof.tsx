import React from 'react';
import { GraduationCap, Zap, Smartphone, ShieldCheck } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const highlights = [
    {
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      title: 'Built for Students & Juniors',
      description: 'Structured to highlight coursework, academic projects, and self-taught codebases.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: '3-Minute Setup',
      description: 'No complicated config or deployment pipelines. Enter details and get published instantly.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-400" />,
      title: '100% Mobile & Recruiter Ready',
      description: 'Engineered to load fast and look stunning on recruiters’ smartphones and laptops.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      title: 'Standard Clean URL',
      description: 'Get an instant clean public link like status200.dev/p/yourname to paste directly on resumes.',
    },
  ];

  return (
    <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
