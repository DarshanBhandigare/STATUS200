import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  ArrowLeft,
  Save,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  User,
  FileText,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Portfolio, PortfolioContent, ThemeSettings, TemplateId, FontStyle, ProjectItem, ExperienceItem, EducationItem, CertificationItem, AchievementItem, SocialLinks } from '@/types/portfolio';
import { DEMO_PORTFOLIOS } from '@/features/portfolio/demoData';
import { PortfolioRenderer } from '@/features/portfolio/templates/PortfolioRenderer';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Modal } from '@/components/common/Modal';
import { ImageUpload } from '@/components/common/ImageUpload';
import { slugify } from '@/lib/utils';

const LOCAL_STORAGE_PORTFOLIOS_KEY = 'devfolio_portfolios';

const ACCENT_COLORS = [
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Sky', hex: '#0284c7' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Teal', hex: '#14b8a6' },
];

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js', 'Python',
  'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL', 'Redis',
  'Git & GitHub', 'REST APIs', 'MongoDB', 'Go', 'Kubernetes', 'Java',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
];

type EditorTab = 'theme' | 'personal' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'certs' | 'social';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('theme');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [skillInput, setSkillInput] = useState<string>('');

  // Fetch Portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);

      const loadLocalPortfolio = () => {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIOS_KEY);
          const list: Portfolio[] = stored ? JSON.parse(stored) : DEMO_PORTFOLIOS;
          const found = list.find((p) => p.id === id);
          setPortfolio(found || list[0] || DEMO_PORTFOLIOS[0]);
        } catch (localError) {
          console.error('Error loading local portfolio:', localError);
          setPortfolio(DEMO_PORTFOLIOS[0]);
        }
      };

      try {
        if (isSupabaseConfigured && supabase && user) {
          const query = supabase
              .from('portfolios')
              .select('*')
              .eq('id', id)
              .single();
          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Portfolio request timed out')), 8000)
          );
          const { data, error } = await Promise.race([query, timeout]);

          if (error) throw error;
          if (data) {
            setPortfolio({
              id: data.id,
              userId: data.user_id,
              title: data.title,
              slug: data.slug,
              template: data.template as TemplateId,
              themeSettings: data.theme_settings,
              content: data.content as PortfolioContent,
              isPublished: data.is_published,
              viewsCount: data.views_count,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            });
          } else {
            loadLocalPortfolio();
          }
        } else {
          loadLocalPortfolio();
        }
      } catch (err: any) {
        console.error('Error fetching portfolio for editor:', err);
        loadLocalPortfolio();
        toastError('Using local portfolio data', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, user]);

  // Update Portfolio Helper
  const updateContent = useCallback((updater: (prev: PortfolioContent) => PortfolioContent) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: updater(prev.content),
        updatedAt: new Date().toISOString(),
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateTheme = useCallback((updater: (prev: ThemeSettings) => ThemeSettings) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        themeSettings: updater(prev.themeSettings),
        updatedAt: new Date().toISOString(),
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  // Save Portfolio Handler
  const handleSave = async () => {
    if (!portfolio) return;
    setIsSaving(true);

    try {
      if (isSupabaseConfigured && supabase && user) {
        const { error } = await supabase
          .from('portfolios')
          .update({
            title: portfolio.title,
            slug: portfolio.slug,
            template: portfolio.template,
            theme_settings: portfolio.themeSettings,
            content: portfolio.content,
            is_published: portfolio.isPublished,
            updated_at: new Date().toISOString(),
          })
          .eq('id', portfolio.id);

        if (error) throw error;
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIOS_KEY);
        let list: Portfolio[] = stored ? JSON.parse(stored) : [];
        const index = list.findIndex((p) => p.id === portfolio.id);
        if (index >= 0) {
          list[index] = { ...portfolio, updatedAt: new Date().toISOString() };
        } else {
          list.push({ ...portfolio, updatedAt: new Date().toISOString() });
        }
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(list));
      }

      setHasUnsavedChanges(false);
      success('Changes Saved', 'Your portfolio updates have been saved.');
    } catch (err: any) {
      console.error('Error saving portfolio:', err);
      toastError('Save Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish / Unpublish Toggle
  const handlePublishToggle = async () => {
    if (!portfolio) return;
    const nextPublished = !portfolio.isPublished;
    const updated = { ...portfolio, isPublished: nextPublished };
    setPortfolio(updated);

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('portfolios')
          .update({ is_published: nextPublished, updated_at: new Date().toISOString() })
          .eq('id', portfolio.id);
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIOS_KEY);
        let list: Portfolio[] = stored ? JSON.parse(stored) : [];
        list = list.map((p) => (p.id === portfolio.id ? updated : p));
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(list));
      }

      if (nextPublished) {
        success('Portfolio Published!', `Public link live at /p/${portfolio.slug}`);
      } else {
        info('Portfolio Unpublished', 'Set to private draft mode.');
      }
    } catch (err: any) {
      toastError('Status update failed', err.message);
    }
  };

  // Add Skill
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || !portfolio) return;
    if (portfolio.content.skills.includes(trimmed)) return;

    updateContent((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput('');
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove: string) => {
    updateContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Add Project
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: 'New Project',
      description: 'Describe what your project solves, architecture choices, and impact.',
      technologies: ['React', 'TypeScript'],
      githubUrl: 'https://github.com/example/repo',
      liveUrl: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      featured: false,
    };

    updateContent((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  // Add Experience
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'Tech Company Inc.',
      role: 'Software Engineer Intern',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      description: 'Implemented backend microservices, optimized database query latency by 30%, and collaborated with product teams.',
    };

    updateContent((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience],
    }));
  };

  const moveExperience = (experienceId: string, direction: 'up' | 'down') => {
    updateContent((prev) => {
      const index = prev.experience.findIndex((item) => item.id === experienceId);
      const nextIndex = direction === 'up' ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= prev.experience.length) {
        return prev;
      }

      const experience = [...prev.experience];
      [experience[index], experience[nextIndex]] = [experience[nextIndex], experience[index]];
      return { ...prev, experience };
    });
  };

  const clearSocialLink = (key: keyof SocialLinks) => {
    updateContent((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: undefined },
    }));
  };

  // Add Education
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: 'State University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2022',
      endDate: '2026',
      description: 'GPA: 3.8 / 4.0. Coursework: Data Structures, Operating Systems, Computer Networks.',
    };

    updateContent((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  // Add Certification
  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2025',
      credentialUrl: 'https://aws.amazon.com/verification',
    };

    updateContent((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  };

  // Add Achievement
  const handleAddAchievement = () => {
    const newAch: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: '1st Place Hackathon Winner',
      description: 'Built a collaborative developer assistant application in 36 hours.',
      date: '2025',
    };

    updateContent((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAch],
    }));
  };

  // JSON Export
  const handleExportJson = () => {
    if (!portfolio) return;
    const jsonStr = JSON.stringify(portfolio.content, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.slug || 'portfolio'}-content.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('JSON Exported', 'Portfolio configuration downloaded.');
  };

  // JSON Import
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed && typeof parsed === 'object') {
        updateContent(() => parsed);
        setIsJsonModalOpen(false);
        setJsonInput('');
        success('JSON Imported', 'Portfolio content successfully loaded!');
      }
    } catch (e: any) {
      toastError('Invalid JSON', 'Please verify your JSON syntax and try again.');
    }
  };

  if (isLoading || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm font-mono">Loading Portfolio Editor workspace...</p>
      </div>
    );
  }

  const { content, themeSettings, template } = portfolio;

  return (
    <div className="app-theme-surface h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Application Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Title */}
          <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={portfolio.title}
              onChange={(e) => {
                setPortfolio({ ...portfolio, title: e.target.value });
                setHasUnsavedChanges(true);
              }}
              className="bg-transparent text-sm sm:text-base font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors px-1 py-0.5"
            />
            {hasUnsavedChanges ? (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ● Unsaved
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 hidden sm:inline">
                ✓ Saved
              </span>
            )}
          </div>
        </div>

        {/* Center: Device View Toggles */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              deviceView === 'desktop' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              deviceView === 'tablet' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              deviceView === 'mobile' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="JSON Import / Export"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          {portfolio.isPublished && (
            <a
              href={`/p/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live</span>
            </a>
          )}

          <Button
            variant={portfolio.isPublished ? 'outline' : 'secondary'}
            size="sm"
            onClick={handlePublishToggle}
            leftIcon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
          >
            {portfolio.isPublished ? 'Live' : 'Publish'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </header>

      {/* Main Workspace (Split Screen: Left Editor Form, Right Live Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Editor Sidebar */}
        <div className="w-full lg:w-[480px] xl:w-[540px] border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 overflow-hidden">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/60 flex-wrap shrink-0">
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'theme'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'personal'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'skills'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Skills ({content.skills.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'projects'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Projects ({content.projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'experience'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'education'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </button>
            <button
              onClick={() => setActiveTab('certs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'certs'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Honors</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                activeTab === 'social'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Socials</span>
            </button>
          </div>

          {/* Editor Form Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* TAB: THEME & TEMPLATE */}
            {activeTab === 'theme' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Portfolio Template
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'minimal' as TemplateId, name: 'Minimalist Terminal', tag: 'Dev Favorite' },
                      { id: 'modern' as TemplateId, name: 'Modern Visual', tag: 'High Impact' },
                      { id: 'professional' as TemplateId, name: 'Professional Recruiter', tag: 'Executive' },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setPortfolio({ ...portfolio, template: tmpl.id });
                          setHasUnsavedChanges(true);
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          template === tmpl.id
                            ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] text-emerald-400 font-mono">{tmpl.tag}</span>
                        <p className="font-semibold text-xs text-white mt-1">{tmpl.name}</p>
                        {template === tmpl.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Accent Color Theme
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => updateTheme((t) => ({ ...t, accentColor: col.hex }))}
                        className={`h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 border ${
                          themeSettings.accentColor === col.hex ? 'border-white ring-2 ring-white/40 scale-105' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {themeSettings.accentColor === col.hex && (
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Font Selection */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Typography Pairing
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'inter' as FontStyle, name: 'Inter (Modern Sans)', sample: 'Clean & readable' },
                      { id: 'plus-jakarta' as FontStyle, name: 'Plus Jakarta Sans', sample: 'Creative tech' },
                      { id: 'mono' as FontStyle, name: 'JetBrains Mono', sample: 'Developer code' },
                      { id: 'serif' as FontStyle, name: 'Editorial Serif', sample: 'Classic executive' },
                    ].map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => updateTheme((t) => ({ ...t, fontStyle: font.id }))}
                        className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                          themeSettings.fontStyle === font.id
                            ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/20'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <p className="font-semibold text-xs text-white">{font.name}</p>
                        <p className="text-[11px] text-slate-400">{font.sample}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode / Light Mode Toggle */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Dark / Light Mode</h3>
                    <p className="text-[11px] text-slate-400">Toggle dark visual ambience.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateTheme((t) => ({ ...t, darkMode: !t.darkMode }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      themeSettings.darkMode
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'bg-slate-200 text-slate-900 border border-slate-300'
                    }`}
                  >
                    {themeSettings.darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  </button>
                </div>

                {/* URL Slug Setting */}
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <Input
                    label="Public Portfolio Slug"
                    value={portfolio.slug}
                    onChange={(e) => {
                      setPortfolio({ ...portfolio, slug: slugify(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                    helperText={`Public URL: /p/${portfolio.slug}`}
                  />
                </div>
              </div>
            )}

            {/* TAB: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    value={content.personal.fullName}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, fullName: e.target.value },
                      }))
                    }
                    required
                  />

                  <Input
                    label="Terminal Username / Handle"
                    placeholder="e.g. darshan"
                    value={content.personal.username || ''}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                        },
                      }))
                    }
                    helperText="Appears in terminal prompts (e.g. username@status200:~$)"
                  />
                </div>

                <Input
                  label="Professional Headline / Title"
                  placeholder="e.g. Full Stack & Cloud Developer"
                  value={content.personal.title}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, title: e.target.value },
                    }))
                  }
                />

                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                  value={content.personal.location}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, location: e.target.value },
                    }))
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Email Address"
                    type="email"
                    value={content.personal.email}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                      }))
                    }
                  />

                  <Input
                    label="Phone (Optional)"
                    value={content.personal.phone}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value },
                      }))
                    }
                  />
                </div>

                <ImageUpload
                  label="Profile Avatar"
                  shape="circle"
                  value={content.personal.avatarUrl}
                  onChange={(url) =>
                    updateContent((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, avatarUrl: url },
                    }))
                  }
                  presets={AVATAR_PRESETS}
                  helperText="Upload your headshot or choose a preset."
                />

                <Textarea
                  label="Short Bio / Introduction"
                  rows={4}
                  value={content.personal.introduction}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, introduction: e.target.value },
                      about: { ...prev.about, bio: e.target.value },
                    }))
                  }
                  helperText="Elevator pitch highlighted at the top of your portfolio."
                />
              </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Add Technical Skills
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Docker, PyTorch"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddSkill(skillInput)}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Quick Add Suggestions */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Quick Suggestions (1-Click Add)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_SUGGESTIONS.filter((s) => !content.skills.includes(s)).map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Active Skills */}
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Active Skills ({content.skills.length})</span>
                    <button
                      onClick={() => updateContent((prev) => ({ ...prev, skills: [] }))}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {content.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Projects Showcase</h3>
                    <p className="text-xs text-slate-400">Add web apps, tools, and algorithms.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddProject}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {content.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              projects: prev.projects.filter((p) => p.id !== proj.id),
                            }))
                          }
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Input
                        label="Project Title"
                        value={proj.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, name: val } : p
                            ),
                          }));
                        }}
                      />

                      <Textarea
                        label="Description & Impact"
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, description: val } : p
                            ),
                          }));
                        }}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="GitHub URL"
                          placeholder="https://github.com/..."
                          value={proj.githubUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, githubUrl: val } : p
                              ),
                            }));
                          }}
                        />

                        <Input
                          label="Live Demo URL"
                          placeholder="https://demo.example.com"
                          value={proj.liveUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, liveUrl: val } : p
                              ),
                            }));
                          }}
                        />
                      </div>

                      <ImageUpload
                        label="Project Screenshot / Preview"
                        shape="banner"
                        value={proj.imageUrl}
                        onChange={(url) => {
                          updateContent((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, imageUrl: url } : p
                            ),
                          }));
                        }}
                        helperText="Upload a screenshot, mockup, or preview of this project."
                      />

                      <Input
                        label="Technologies (comma separated)"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const val = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          updateContent((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, technologies: val } : p
                            ),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Work Experience</h3>
                    <p className="text-xs text-slate-400">Internships, developer roles, and tech leadership.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddExperience}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Role
                  </Button>
                </div>

                <div className="space-y-4">
                  {content.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">Role #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveExperience(exp.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-500 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move experience up"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExperience(exp.id, 'down')}
                            disabled={idx === content.experience.length - 1}
                            className="p-1 text-slate-500 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move experience down"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateContent((prev) => ({
                                ...prev,
                                experience: prev.experience.filter((e) => e.id !== exp.id),
                              }))
                            }
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            aria-label="Delete experience"
                            title="Delete experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Job Role / Title"
                          value={exp.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, role: val } : item
                              ),
                            }));
                          }}
                        />

                        <Input
                          label="Company / Organization"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, company: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Start Date"
                          placeholder="e.g. Jun 2025"
                          value={exp.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, startDate: val } : item
                              ),
                            }));
                          }}
                        />

                        <Input
                          label="End Date"
                          placeholder="e.g. Present or Aug 2025"
                          value={exp.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, endDate: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>

                      <Textarea
                        label="Responsibilities & Key Achievements"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) =>
                              item.id === exp.id ? { ...item, description: val } : item
                            ),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Education & Degrees</h3>
                    <p className="text-xs text-slate-400">Colleges, universities, and coursework.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddEducation}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {content.education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">Degree #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              education: prev.education.filter((e) => e.id !== edu.id),
                            }))
                          }
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Input
                        label="Institution / University"
                        value={edu.institution}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            education: prev.education.map((item) =>
                              item.id === edu.id ? { ...item, institution: val } : item
                            ),
                          }));
                        }}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Degree"
                          placeholder="e.g. Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, degree: val } : item
                              ),
                            }));
                          }}
                        />

                        <Input
                          label="Field of Study"
                          placeholder="e.g. Computer Science"
                          value={edu.field}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, field: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Start Year"
                          value={edu.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, startDate: val } : item
                              ),
                            }));
                          }}
                        />

                        <Input
                          label="Graduation Year"
                          value={edu.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, endDate: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>

                      <Textarea
                        label="GPA & Relevant Coursework"
                        rows={2}
                        value={edu.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            education: prev.education.map((item) =>
                              item.id === edu.id ? { ...item, description: val } : item
                            ),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CERTS & AWARDS */}
            {activeTab === 'certs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Certifications</h3>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddCertification}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Cert
                    </Button>
                  </div>

                  {content.certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          label="Certification Name"
                          value={cert.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((item) =>
                                item.id === cert.id ? { ...item, name: val } : item
                              ),
                            }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter((item) => item.id !== cert.id),
                            }))
                          }
                          className="text-slate-500 hover:text-rose-400 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Issuer"
                          placeholder="e.g. AWS, Meta"
                          value={cert.issuer}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((item) =>
                                item.id === cert.id ? { ...item, issuer: val } : item
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Date"
                          placeholder="e.g. Jan 2025"
                          value={cert.date}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((item) =>
                                item.id === cert.id ? { ...item, date: val } : item
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Awards & Hackathons</h3>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddAchievement}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Award
                    </Button>
                  </div>

                  {content.achievements.map((ach, idx) => (
                    <div key={ach.id || idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          label="Award Title"
                          value={ach.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              achievements: prev.achievements.map((item) =>
                                item.id === ach.id ? { ...item, title: val } : item
                              ),
                            }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              achievements: prev.achievements.filter((item) => item.id !== ach.id),
                            }))
                          }
                          className="text-slate-500 hover:text-rose-400 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Textarea
                        label="Description"
                        rows={2}
                        value={ach.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => ({
                            ...prev,
                            achievements: prev.achievements.map((item) =>
                              item.id === ach.id ? { ...item, description: val } : item
                            ),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SOCIALS & RESUME */}
            {activeTab === 'social' && (
              <div className="space-y-4 animate-fadeIn">
                <Input
                  label="GitHub Profile URL"
                  placeholder="https://github.com/username"
                  value={content.socialLinks?.github || ''}
                  rightIcon={content.socialLinks?.github ? (
                    <button type="button" onClick={() => clearSocialLink('github')} className="hover:text-rose-400" aria-label="Remove GitHub link" title="Remove GitHub link">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : undefined}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, github: e.target.value },
                    }))
                  }
                />

                <Input
                  label="LinkedIn Profile URL"
                  placeholder="https://linkedin.com/in/username"
                  value={content.socialLinks?.linkedin || ''}
                  rightIcon={content.socialLinks?.linkedin ? (
                    <button type="button" onClick={() => clearSocialLink('linkedin')} className="hover:text-rose-400" aria-label="Remove LinkedIn link" title="Remove LinkedIn link">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : undefined}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                    }))
                  }
                />

                <Input
                  label="Twitter / X URL"
                  placeholder="https://x.com/username"
                  value={content.socialLinks?.twitter || ''}
                  rightIcon={content.socialLinks?.twitter ? (
                    <button type="button" onClick={() => clearSocialLink('twitter')} className="hover:text-rose-400" aria-label="Remove Twitter link" title="Remove Twitter link">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : undefined}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                    }))
                  }
                />

                <Input
                  label="Personal Website"
                  placeholder="https://yourdomain.com"
                  value={content.socialLinks?.website || ''}
                  rightIcon={content.socialLinks?.website ? (
                    <button type="button" onClick={() => clearSocialLink('website')} className="hover:text-rose-400" aria-label="Remove website link" title="Remove website link">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : undefined}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value },
                    }))
                  }
                />

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase">Resume Attachment</h3>
                  <Input
                    label="Resume PDF Link / URL"
                    placeholder="https://example.com/resume.pdf"
                    value={content.resume?.url || ''}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        resume: { ...prev.resume, url: e.target.value },
                      }))
                    }
                    helperText="Direct download link shown on your public portfolio."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Preview Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Simulated Screen Container */}
          <div
            className={`h-full max-h-[92vh] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              deviceView === 'desktop'
                ? 'w-full'
                : deviceView === 'tablet'
                ? 'w-[768px]'
                : 'w-[375px]'
            }`}
          >
            {/* Simulated Browser Bar */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="px-4 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 max-w-sm truncate">
                https://status-200.vercel.app/p/{portfolio.slug}
              </div>

              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Preview
              </span>
            </div>

            {/* Rendered Template Output */}
            <div
              className={`portfolio-preview ${
                themeSettings.darkMode ? 'portfolio-preview-dark' : 'portfolio-preview-light'
              } flex-1 overflow-y-auto`}
            >
              <PortfolioRenderer
                content={content}
                theme={themeSettings}
                template={template}
                isPublic={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* JSON Import/Export Modal */}
      <Modal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        title="Portfolio JSON Import & Export"
        description="Directly edit, backup, or restore your portfolio structured data."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <Textarea
            label="JSON Data"
            rows={10}
            value={jsonInput || JSON.stringify(content, null, 2)}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-xs"
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download JSON File
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsJsonModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleImportJson}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Apply JSON
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
