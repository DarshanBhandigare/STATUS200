import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
  Copy,
  Clock,
  Layers,
} from 'lucide-react';
import { Portfolio } from '@/types/portfolio';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onPublishToggle: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onPublishToggle,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { success } = useToast();
  const navigate = useNavigate();

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/p/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    success('Link Copied!', `Public URL for "${portfolio.title}" copied to clipboard.`);
    setMenuOpen(false);
  };

  const getTemplateLabel = (template: string) => {
    switch (template) {
      case 'minimal':
        return 'Minimalist Terminal';
      case 'modern':
        return 'Modern Visual';
      case 'professional':
        return 'Professional Recruiter';
      default:
        return template;
    }
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/90 transition-all duration-300 shadow-subtle hover:shadow-card flex flex-col overflow-hidden">
      {/* Visual Thumbnail Area */}
      <div className="relative h-44 w-full bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-center overflow-hidden p-4 group-hover:bg-slate-950/40 transition-colors">
        {/* Mock visual preview representation */}
        <div className="w-full h-full rounded-lg bg-slate-900 border border-slate-800/90 p-3 shadow-inner flex flex-col justify-between transform group-hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">/p/{portfolio.slug}</span>
          </div>

          <div className="space-y-1.5 my-auto">
            <p className="text-xs font-semibold text-slate-200 line-clamp-1">
              {portfolio.content.personal.fullName || portfolio.title}
            </p>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              {portfolio.content.personal.title || 'Developer Portfolio'}
            </p>
            <div className="flex items-center gap-1">
              {portfolio.content.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
              {portfolio.content.skills.length > 3 && (
                <span className="text-[9px] text-slate-500">
                  +{portfolio.content.skills.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              {getTemplateLabel(portfolio.template)}
            </span>
          </div>
        </div>

        {/* Status Pill on top of thumbnail */}
        <div className="absolute top-3 left-3">
          {portfolio.isPublished ? (
            <Badge variant="success" className="shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Published
            </Badge>
          ) : (
            <Badge variant="default" className="shadow-sm bg-slate-900/90">
              Draft
            </Badge>
          )}
        </div>

        {/* More Actions Dropdown */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-700/80 backdrop-blur-sm transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1 z-20 text-xs animate-slide-up">
                  {portfolio.isPublished && (
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Public Link
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onPublishToggle(portfolio);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    {portfolio.isPublished ? 'Unpublish' : 'Publish Portfolio'}
                  </button>
                  <div className="my-1 border-t border-slate-800" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(portfolio.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display font-semibold text-base text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {portfolio.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Updated {formatRelativeTime(portfolio.updatedAt)}
          </p>
        </div>

        {/* Metrics & Slug row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-slate-200">{portfolio.viewsCount}</strong> views
          </span>

          <span className="font-mono text-[11px] text-slate-500">
            /{portfolio.slug}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // When Phase 2 editor is active, routes to /editor/:id. For Phase 1, we provide a clean toast/handler.
              navigate(`/editor/${portfolio.id}`);
            }}
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            className="w-full"
          >
            Edit
          </Button>

          <Button
            variant={portfolio.isPublished ? 'outline' : 'primary'}
            size="sm"
            onClick={() => onPublishToggle(portfolio)}
            leftIcon={<Globe className="w-3.5 h-3.5" />}
            className="w-full"
          >
            {portfolio.isPublished ? 'Published' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
};
