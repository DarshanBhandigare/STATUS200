import React from 'react';
import { Plus, FolderPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const EmptyState: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  return (
    <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center max-w-2xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 mb-4 shadow-subtle">
        <FolderPlus className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-display font-semibold text-slate-100 mb-2">
        You haven't created a portfolio yet.
      </h3>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        Launch your first recruiter-ready portfolio in under 3 minutes. Choose a template, add your projects, and get an instant shareable link.
      </p>

      <Button
        variant="primary"
        size="lg"
        onClick={onAction}
        leftIcon={<Plus className="w-5 h-5" />}
        className="shadow-glow"
      >
        Create your first portfolio
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 mt-10 pt-8 border-t border-slate-800/80 w-full text-left">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No coding or HTML required</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Real-time instant live preview</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Custom shareable <code className="text-emerald-300">/p/slug</code></span>
        </div>
      </div>
    </div>
  );
};
