import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { TemplateId } from '@/types/portfolio';
import { slugify, isValidSlug } from '@/lib/utils';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, slug: string, template: TemplateId) => Promise<void>;
  canCustomizeSlug: boolean;
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; description: string }[] = [
  {
    id: 'minimal',
    name: 'Minimalist Terminal',
    tag: 'Recruiter Favorite',
    description: 'Clean, distraction-free typography focused on skills, projects, and impact.',
  },
  {
    id: 'modern',
    name: 'Modern Visual',
    tag: 'Project Heavy',
    description: 'Rich card layouts, preview tags, and sleek dark mode visual hierarchy.',
  },
  {
    id: 'professional',
    name: 'Professional Recruiter',
    tag: 'Executive Style',
    description: 'Structured resume-inspired layout with prominent credentials and experience.',
  },
];

export const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  canCustomizeSlug,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('minimal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; slug?: string }>({});

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugify(val));
    }
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setSlug(slugify(e.target.value));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; slug?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Portfolio title is required';
    }

    const generatedSlug = `portfolio-${Math.random().toString(36).slice(2, 8)}`;
    const requestedSlug = canCustomizeSlug ? slug : generatedSlug;

    if (canCustomizeSlug && !slug.trim()) {
      newErrors.slug = 'Public slug is required';
    } else if (canCustomizeSlug && !isValidSlug(slug)) {
      newErrors.slug = 'Slug must be 3-48 characters, lowercase letters, numbers, and hyphens only';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title, requestedSlug, selectedTemplate);
      setTitle('');
      setSlug('');
      setSlugTouched(false);
      setSelectedTemplate('minimal');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Portfolio"
      description="Launch an internship-ready developer portfolio in seconds."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Portfolio Name"
          placeholder="e.g. Alex Morgan — Full Stack Engineer"
          value={title}
          onChange={handleTitleChange}
          error={errors.title}
          required
          autoFocus
        />

        {canCustomizeSlug ? <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Public Portfolio URL Slug <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 focus-within:border-emerald-500 overflow-hidden text-sm">
            <span className="px-3 py-2 bg-slate-800 text-slate-400 text-xs font-mono border-r border-slate-700 select-none">
              status-200.vercel.app/p/
            </span>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="your-name"
              className="flex-1 bg-transparent px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none text-xs font-mono"
            />
          </div>
          {errors.slug ? (
            <p className="text-xs text-rose-400">{errors.slug}</p>
          ) : (
            <p className="text-[11px] text-slate-500">
              Shareable public link recruiters will visit. You can change this later.
            </p>
          )}
        </div> : (
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
            Your Free portfolio will receive an automatic public URL. Upgrade to Pro to choose a custom slug.
          </div>
        )}

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Choose Starting Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedTemplate === tmpl.id
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      {tmpl.tag}
                    </span>
                    {selectedTemplate === tmpl.id && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{tmpl.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {tmpl.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Create Portfolio
          </Button>
        </div>
      </form>
    </Modal>
  );
};
