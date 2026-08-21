import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Portfolio, TemplateId, PortfolioContent } from '@/types/portfolio';
import { DEMO_PORTFOLIOS, DEMO_PORTFOLIO_CONTENT } from '@/features/portfolio/demoData';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsBar } from '@/features/dashboard/StatsBar';
import { PortfolioCard } from '@/features/dashboard/PortfolioCard';
import { CreatePortfolioModal } from '@/features/dashboard/CreatePortfolioModal';
import { EmptyState } from '@/features/dashboard/EmptyState';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { slugify } from '@/lib/utils';

const LOCAL_STORAGE_PORTFOLIOS_KEY = 'devfolio_portfolios';
const MAX_SLUG_SUFFIX_ATTEMPTS = 50;

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load Portfolios
  const loadPortfolios = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && user) {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: Portfolio[] = data.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            slug: item.slug,
            template: item.template as TemplateId,
            themeSettings: item.theme_settings,
            content: item.content as PortfolioContent,
            isPublished: item.is_published,
            viewsCount: item.views_count,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
          setPortfolios(mapped);
        }
      } else {
        // Local Mode
        const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIOS_KEY);
        if (stored) {
          try {
            setPortfolios(JSON.parse(stored));
          } catch {
            setPortfolios(DEMO_PORTFOLIOS);
          }
        } else {
          localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(DEMO_PORTFOLIOS));
          setPortfolios(DEMO_PORTFOLIOS);
        }
      }
    } catch (err: any) {
      console.error('Error fetching portfolios:', err);
      toastError('Failed to load portfolios', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, [user]);

  const doesSlugExistLocally = (candidateSlug: string) =>
    portfolios.some((portfolio) => portfolio.slug === candidateSlug);

  const doesSlugExistInDatabase = async (candidateSlug: string) => {
    if (!isSupabaseConfigured || !supabase) return false;

    const { data, error } = await supabase
      .from('portfolios')
      .select('id')
      .eq('slug', candidateSlug)
      .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
  };

  const resolveUniqueSlug = async (requestedSlug: string) => {
    const baseSlug = slugify(requestedSlug) || `portfolio-${Date.now().toString(36)}`;

    for (let suffix = 0; suffix < MAX_SLUG_SUFFIX_ATTEMPTS; suffix += 1) {
      const candidate = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
      const existsLocally = doesSlugExistLocally(candidate);
      const existsInDb = await doesSlugExistInDatabase(candidate);

      if (!existsLocally && !existsInDb) {
        return candidate;
      }
    }

    return `${baseSlug}-${Date.now().toString(36)}`;
  };

  const isUniqueConstraintError = (err: any) =>
    err?.code === '23505' || /duplicate key value violates unique constraint/i.test(err?.message || '');

  // Create Portfolio Handler
  const handleCreatePortfolio = async (title: string, slug: string, template: TemplateId) => {
    if (!user) return;

    const newPortfolioContent: PortfolioContent = {
      ...DEMO_PORTFOLIO_CONTENT,
      personal: {
        ...DEMO_PORTFOLIO_CONTENT.personal,
        fullName: user.fullName || 'Software Developer',
        email: user.email || 'developer@example.com',
      },
    };

    const newPortfolio: Portfolio = {
      id: isSupabaseConfigured
        ? `temp_${Date.now()}`
        : `port_${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      title,
      slug: slugify(slug || title) || `portfolio-${Date.now().toString(36)}`,
      template,
      themeSettings: {
        accentColor: template === 'modern' ? '#6366f1' : '#10b981',
        fontStyle: template === 'modern' ? 'plus-jakarta' : 'inter',
        darkMode: true,
      },
      content: newPortfolioContent,
      isPublished: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      let createError: any = null;
      const baseSlug = newPortfolio.slug;
      let nextSlug = baseSlug;

      for (let attempt = 0; attempt < MAX_SLUG_SUFFIX_ATTEMPTS; attempt += 1) {
        nextSlug = await resolveUniqueSlug(nextSlug);
        newPortfolio.slug = nextSlug;

        const { data, error } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            title: newPortfolio.title,
            slug: newPortfolio.slug,
            template: newPortfolio.template,
            theme_settings: newPortfolio.themeSettings,
            content: newPortfolio.content,
            is_published: false,
          })
          .select()
          .single();

        if (!error && data) {
          newPortfolio.id = data.id;
          createError = null;
          break;
        }

        createError = error;
        if (!isUniqueConstraintError(error)) {
          break;
        }

        nextSlug = `${baseSlug}-${attempt + 2}`;
      }

      if (createError) {
        toastError('Failed to create portfolio', createError.message);
        throw createError;
      }
    } else {
      const updatedList = [newPortfolio, ...portfolios];
      localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(updatedList));
    }

    setPortfolios((prev) => [newPortfolio, ...prev]);
    success('Portfolio Created!', `"${title}" has been created successfully at /p/${newPortfolio.slug}.`);
  };

  // Publish / Unpublish Toggle
  const handlePublishToggle = async (portfolio: Portfolio) => {
    const nextStatus = !portfolio.isPublished;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('portfolios')
          .update({ is_published: nextStatus, updated_at: new Date().toISOString() })
          .eq('id', portfolio.id);

        if (error) throw error;
      } else {
        const updatedList = portfolios.map((p) =>
          p.id === portfolio.id
            ? { ...p, isPublished: nextStatus, updatedAt: new Date().toISOString() }
            : p
        );
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(updatedList));
      }

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolio.id
            ? { ...p, isPublished: nextStatus, updatedAt: new Date().toISOString() }
            : p
        )
      );

      if (nextStatus) {
        success('Portfolio Published!', `Your portfolio is now live at /p/${portfolio.slug}`);
      } else {
        info('Portfolio Unpublished', `"${portfolio.title}" is now set to draft.`);
      }
    } catch (err: any) {
      toastError('Update Failed', err.message);
    }
  };

  // Delete Portfolio Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('portfolios')
          .delete()
          .eq('id', deleteTargetId);

        if (error) throw error;
      } else {
        const updatedList = portfolios.filter((p) => p.id !== deleteTargetId);
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIOS_KEY, JSON.stringify(updatedList));
      }

      setPortfolios((prev) => prev.filter((p) => p.id !== deleteTargetId));
      success('Portfolio Deleted', 'The portfolio was permanently removed.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toastError('Deletion Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout onNewPortfolio={() => setIsCreateModalOpen(true)}>
      <div className="space-y-8">
        {/* Page Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Your Portfolios
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage, customize, and publish your developer portfolios.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPortfolios}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Portfolio
            </Button>
          </div>
        </div>

        {/* Top Metrics Stats */}
        {!isLoading && portfolios.length > 0 && <StatsBar portfolios={portfolios} />}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4"
              >
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && portfolios.length === 0 && (
          <EmptyState onAction={() => setIsCreateModalOpen(true)} />
        )}

        {/* Portfolios Grid */}
        {!isLoading && portfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onPublishToggle={handlePublishToggle}
                onDelete={(id) => setDeleteTargetId(id)}
              />
            ))}
          </div>
        )}

        {/* Create Portfolio Modal */}
        <CreatePortfolioModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePortfolio}
            canCustomizeSlug={Boolean(user?.isPro)}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          title="Delete Portfolio"
          description="Are you sure you want to delete this portfolio? This action cannot be undone."
          maxWidth="sm"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Public link will immediately stop resolving.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
