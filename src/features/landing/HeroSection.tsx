import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Briefcase,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'experience'>('projects');

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-subtle">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">AI profile builder for CS & IT students</span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span>Internship Ready</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Build a portfolio that gets you noticed.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Create a professional developer portfolio in minutes - no coding required. Stand out to tech recruiters and land high-impact internships.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-glow"
              >
                Create My Portfolio
              </Button>

              <a
                href="#templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all shadow-sm"
              >
                Explore Templates
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                Instant shareable URL
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                Zero code needed
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Interactive Portfolio Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-2xl bg-slate-900 border border-slate-800/90 shadow-2xl p-4 sm:p-6 overflow-hidden">
              {/* Top Browser Chrome simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <a
                  href="/p/alex-morgan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-md bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>status-200.vercel.app/p/alex-morgan</span>
                </a>
                <Badge variant="success" size="sm">
                  LIVE
                </Badge>
              </div>

              {/* Portfolio Body Preview */}
              <div className="pt-5 space-y-5">
                {/* Profile Header */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                      alt="Alex Morgan"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500/40 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-950">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base text-white truncate">
                        Alex Morgan
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Open for Roles
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-medium">
                      Full Stack & Cloud Developer
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      B.Sc Computer Science @ XYZ University | Graduating 2026
                    </p>
                  </div>
                </div>

                {/* Micro Tab switcher */}
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`pb-1 px-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === 'projects'
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Featured Projects
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`pb-1 px-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === 'skills'
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    Skills
                  </button>
                  <button
                    onClick={() => setActiveTab('experience')}
                    className={`pb-1 px-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === 'experience'
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Experience
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'projects' && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-slate-200">
                            PulseFlow - Systems Monitor
                          </h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                            Featured
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          Observability dashboard for microservices with real-time WebSocket telemetry and custom alerting.
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['React', 'TypeScript', 'Node.js', 'Redis'].map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                        <GithubIcon className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
                        <ExternalLink className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-slate-200">
                          AlgoCanvas - Algorithm Visualizer
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          Interactive graph traversal and pathfinding visualizer with canvas animations.
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['React', 'TypeScript', 'Canvas API'].map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="animate-fadeIn space-y-2 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'React',
                        'TypeScript',
                        'Node.js',
                        'Next.js',
                        'PostgreSQL',
                        'Docker',
                        'Tailwind CSS',
                        'Python',
                        'Supabase',
                        'Git',
                        'REST APIs',
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium text-xs flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="animate-fadeIn space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-200">Apex Cloud Solutions</p>
                        <span className="text-[10px] text-slate-400">Summer 2025</span>
                      </div>
                      <p className="text-[11px] text-emerald-400">Software Engineering Intern</p>
                      <p className="text-[11px] text-slate-400">
                        Built high-throughput REST APIs handling 50k+ requests/day.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
