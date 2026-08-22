import React from 'react';
import { Card } from '@/components/common/Card';

const FAQS = [
  {
    question: 'What is Status 200?',
    answer:
      'Status 200 is a developer portfolio builder that helps students and developers create a polished public profile, publish it to a shareable URL, and keep it updated without writing custom code.',
  },
  {
    question: 'Is this an AI profile builder?',
    answer:
      'Yes. Status 200 works like an AI profile builder for developer portfolios by guiding you through your bio, projects, skills, and experience so the final profile is structured, clear, and recruiter-friendly.',
  },
  {
    question: 'Do I need to pay to get started?',
    answer:
      'No. You can start on the free plan and publish a portfolio without paying first. The Pro upgrade is only for people who want a custom slug and the extra premium features.',
  },
  {
    question: 'Is the Pro upgrade a subscription?',
    answer:
      'No. Pro is a one-time payment, so you upgrade once and keep the premium benefits without recurring billing.',
  },
  {
    question: 'Can I change templates later?',
    answer:
      'Yes. You can switch between templates after creating your portfolio, and your existing content refits automatically.',
  },
  {
    question: 'How do I get my profile to appear on Google?',
    answer:
      'Publish your portfolio, use a clean slug, add descriptive project titles, and keep the page indexable. Status 200 includes those SEO basics so public profiles can be crawled by Google.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 md:py-28 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            SEO-friendly FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Common questions about the AI profile builder.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            These answers help visitors and search engines understand what Status 200 does and who it is for.
          </p>
        </div>

        <div className="grid gap-4">
          {FAQS.map((faq) => (
            <Card
              key={faq.question}
              className="p-5 sm:p-6 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <details className="group">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 font-display">
                    {faq.question}
                  </h3>
                  <span className="mt-1 text-emerald-500 dark:text-emerald-400 text-lg font-semibold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl">
                  {faq.answer}
                </p>
              </details>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
