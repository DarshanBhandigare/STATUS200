import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Layout,
  Briefcase,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const TemplatesPreview: React.FC = () => {
  const [selected, setSelected] = useState<'minimal' | 'modern' | 'professional'>('minimal');
  const navigate = useNavigate();

  const templates = [
    {
      id: 'minimal' as const,
      name: 'Minimalist Terminal',
      tag: 'Developer Focus',
      description:
        'Inspired by modern terminal aesthetics and clean typography. Highly favored by engineering managers who appreciate concise technical clarity.',
      accent: 'emerald',
      features: ['Monochrome & high contrast', 'Dense project listing', 'Terminal command header style'],
    },
    {
      id: 'modern' as const,
      name: 'Modern Visual',
      tag: 'Project Heavy',
      description:
        'Vibrant card-based presentation optimized for full-stack and frontend developers who want rich project screenshots, live demo tags, and tech badges.',
      accent: 'indigo',
      features: ['Card grid layout', 'Visual technology badges', 'Interactive live preview buttons'],
    },
    {
      id: 'professional' as const,
      name: 'Professional Recruiter',
      tag: 'Corporate & Internship',
      description:
        'Structured two-column executive format crafted specifically for campus recruiting, enterprise software roles, and PDF resume synergy.',
      accent: 'sky',
      features: ['Two-column resume flow', 'Education & GPA showcase', 'Verified credentials badge'],
    },
  ];

  return (
    <section id="templates" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Design Templates
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Designed for different developer styles.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Switch styles anytime with one click. Your information automatically refits without retyping.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                selected === tmpl.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              {tmpl.id === 'minimal' && <Terminal className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
              {tmpl.id === 'modern' && <Layout className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
              {tmpl.id === 'professional' && <Briefcase className="w-4 h-4 text-sky-500 dark:text-sky-400" />}
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>

        {/* Active Template Showcase Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          {/* Template Info (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <Badge variant="purple" size="sm">
                {templates.find((t) => t.id === selected)?.tag}
              </Badge>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                {templates.find((t) => t.id === selected)?.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {templates.find((t) => t.id === selected)?.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Highlights
              </p>
              {templates
                .find((t) => t.id === selected)
                ?.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Use this Template
              </Button>
              <a
                href={`/p/alex-morgan`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <span>Live Interactive Demo</span>
              </a>
            </div>
          </div>

          {/* Realistic Template Simulation Frame (Right 7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
              {/* Browser toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono text-slate-500">
                <span>template_preview: {selected}.theme</span>
                <span className="text-emerald-400">● Ready to deploy</span>
              </div>

              {/* Minimal Terminal Template Mock */}
              {selected === 'minimal' && (
                <div className="space-y-4 animate-fadeIn font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-emerald-400">$ whoami</span>
                    <h4 className="text-sm font-bold text-slate-100 mt-1 font-sans">
                      Alex Morgan — Software Developer
                    </h4>
                    <p className="text-slate-400 font-sans text-xs mt-1">
                      Building distributed systems & developer tools. CS @ XYZ University.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">$ cat ./projects.log</div>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">01. PulseFlow Telemetry</span>
                        <span className="text-[10px] text-emerald-400">TypeScript / Redis</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        Real-time WebSocket observability daemon for high-traffic microservices.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modern Visual Template Mock */}
              {selected === 'modern' && (
                <div className="space-y-4 animate-fadeIn text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-glow">
                      AM
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Alex Morgan</h4>
                      <p className="text-[11px] text-indigo-400">Full Stack & Creative Engineer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-1.5">
                      <div className="h-16 rounded-lg bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px]">
                        UI Preview
                      </div>
                      <p className="font-semibold text-slate-200 text-xs">AlgoCanvas</p>
                      <p className="text-[10px] text-slate-400">Interactive Algorithm visualizer</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="h-16 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-[10px]">
                        Web App
                      </div>
                      <p className="font-semibold text-slate-200 text-xs">PulseFlow</p>
                      <p className="text-[10px] text-slate-400">Observability dashboard</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Recruiter Template Mock */}
              {selected === 'professional' && (
                <div className="space-y-4 animate-fadeIn text-xs">
                  <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-100 font-display">
                        Alex Morgan, B.Sc.
                      </h4>
                      <p className="text-xs text-slate-400">
                        Candidate for Software Engineering Internship
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <p>XYZ University • 3.85 GPA</p>
                      <p className="text-emerald-400">Available Summer 2026</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
                      <p className="font-semibold text-slate-300">Technical Skills</p>
                      <p className="text-slate-400">React, TypeScript, Node.js, PostgreSQL, Docker, AWS</p>
                    </div>
                    <div className="col-span-8 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
                      <p className="font-semibold text-slate-300">Engineering Internship</p>
                      <p className="text-slate-400">
                        Apex Cloud Solutions — Optimized SQL latency by 35% across 50k requests/day.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
