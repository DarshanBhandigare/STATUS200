import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Share2,
  Lock,
  ArrowRight,
  Check,
  Download,
  RefreshCw,
  AlertCircle,
  Home,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Portfolio, PortfolioContent, TemplateId } from '@/types/portfolio';
import { DEMO_PORTFOLIOS } from '@/features/portfolio/demoData';
import { PortfolioRenderer } from '@/features/portfolio/templates/PortfolioRenderer';
import { DEFAULT_THEME_SETTINGS, EMPTY_PORTFOLIO_CONTENT } from '@/features/portfolio/defaults';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { Seo } from '@/components/common/Seo';

const LOCAL_STORAGE_PORTFOLIOS_KEY = 'devfolio_portfolios';

export const PublicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { success } = useToast();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ownerIsPro, setOwnerIsPro] = useState(false);

  useEffect(() => {
    const loadPublicPortfolio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const customDomain = !slug
          ? window.location.hostname.replace(/^www\./, '').toLowerCase()
          : null;

        if (isSupabaseConfigured && supabase) {
          let ownerId: string | null = null;
          if (customDomain) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('custom_domain', customDomain)
              .single();
            ownerId = profile?.id || null;
          }

          const query = supabase.from('portfolios').select('*');
          const { data, error: fetchErr } = customDomain
            ? await query.eq('user_id', ownerId || '').eq('is_published', true).maybeSingle()
            : await query.eq('slug', slug).single();

          if (data && !fetchErr) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_pro')
              .eq('id', data.user_id)
              .maybeSingle();

            setOwnerIsPro(profile?.is_pro === true);
            const mapped: Portfolio = {
              id: data.id,
              userId: data.user_id,
              title: data.title,
              slug: data.slug,
              template: data.template as TemplateId,
              themeSettings: data.theme_settings ?? DEFAULT_THEME_SETTINGS,
              content: (data.content as PortfolioContent) ?? EMPTY_PORTFOLIO_CONTENT,
              isPublished: data.is_published,
              viewsCount: data.views_count,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };

            setPortfolio(mapped);

            if (data.is_published) {
              await supabase
                .from('portfolios')
                .update({ views_count: (data.views_count || 0) + 1 })
                .eq('id', data.id);
            }
          } else {
            const demo = DEMO_PORTFOLIOS.find((p) => p.slug === slug);
            if (demo) {
              setPortfolio(demo);
              setOwnerIsPro(false);
            } else {
              setError('Portfolio not found');
            }
          }
        } else {
          const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIOS_KEY);
          const localList: Portfolio[] = stored ? JSON.parse(stored) : [];
          const found = localList.find((p) => p.slug === slug);

          if (found) {
            setPortfolio(found);
            setOwnerIsPro(false);
            const updated = localList.map((p) =>
              p.slug === slug ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p
            );
            localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(updated));
          } else {
            const demo = DEMO_PORTFOLIOS.find((p) => p.slug === slug);
            if (demo) {
              setPortfolio(demo);
              setOwnerIsPro(false);
            } else {
              setError('Portfolio not found');
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading public portfolio:', err);
        const demo = DEMO_PORTFOLIOS.find((p) => p.slug === slug);
        if (demo) {
          setPortfolio(demo);
          setOwnerIsPro(false);
        } else {
          setError('Failed to load portfolio');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicPortfolio();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    success('Link Copied!', 'Portfolio URL copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center space-y-4">
        <Seo
          title="Loading Portfolio"
          description="Loading a public developer portfolio on Status 200."
          canonicalPath={slug ? `/p/${slug}` : '/'}
          noindex
        />
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs font-mono">Loading developer portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <Seo
          title="Portfolio Not Found"
          description="The requested public portfolio could not be found."
          canonicalPath={slug ? `/p/${slug}` : '/'}
          noindex
        />
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 mb-6 shadow-glow">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          Portfolio Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-8">
          The portfolio at <code className="text-emerald-400 font-mono">/p/{slug}</code> does not exist or has been removed.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Your Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!portfolio.isPublished) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <Seo
          title={portfolio.title || 'Draft Portfolio'}
          description="This portfolio is private and not available to search engines."
          canonicalPath={slug ? `/p/${slug}` : '/'}
          noindex
        />
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-6 shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          This Portfolio is in Draft Mode
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-8">
          The author has set <strong className="text-slate-200">"{portfolio.title}"</strong> to private. If you are the owner, sign in to your dashboard to publish it.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="primary" size="md">
              Sign In to Publish
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="md">
              Back to Status 200
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Seo
        title={`${portfolio.title} - Developer Portfolio`}
        description={
          portfolio.content.personal.introduction ||
          portfolio.content.about.bio ||
          `Explore ${portfolio.content.personal.fullName || portfolio.title}'s developer portfolio on Status 200.`
        }
        canonicalPath={slug ? `/p/${slug}` : '/'}
      />
      <main className="flex-1">
        <PortfolioRenderer
          content={portfolio.content}
          theme={portfolio.themeSettings}
          template={portfolio.template}
          isPublic={true}
        />
      </main>

      <div className="fixed bottom-4 right-4 sm:right-6 z-50 flex items-center gap-2 print:hidden">
        {portfolio.content?.resume?.url && (
          <a
            href={portfolio.content.resume.url}
            download={portfolio.content.resume.filename || `${portfolio.title || portfolio.slug || 'portfolio'}-Resume.pdf`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold border border-emerald-400/80 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            title="Download Resume"
            aria-label="Download Resume"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Download Resume</span>
          </a>
        )}

        <button
          onClick={handleCopyLink}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
          title="Copy Portfolio URL"
          aria-label="Copy Portfolio Link"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        {!ownerIsPro && (
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 group"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
              <Sparkles className="w-3 h-3 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-display">Built with Status 200</span>
          </Link>
        )}
      </div>
    </div>
  );
};
