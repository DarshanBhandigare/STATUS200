import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/common/Seo';

const sections = [
  {
    title: 'Information we collect',
    body: [
      'We may collect account details you provide, such as your name, email address, profile content, and portfolio data.',
      'If you use our payment flow, payment processing is handled by third-party providers and we may receive limited transaction metadata.',
      'We may also collect technical information such as device data, browser type, and usage analytics to keep the service reliable and secure.',
    ],
  },
  {
    title: 'How we use information',
    body: [
      'We use information to create and publish your portfolio, authenticate your account, process payments, and provide support.',
      'We may use usage data to improve product performance, troubleshoot issues, and understand which features are most useful.',
      'We do not sell your personal information.',
    ],
  },
  {
    title: 'Sharing and disclosure',
    body: [
      'We may share information with service providers that help us operate the product, such as hosting, authentication, analytics, and payments.',
      'We may disclose information if required by law, to protect our rights, or to prevent abuse or fraud.',
    ],
  },
  {
    title: 'Data retention and security',
    body: [
      'We keep your information only as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements.',
      'We use reasonable technical and organizational safeguards, but no system is completely secure.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      'You may review, update, or delete parts of your account content through the product where available.',
      'You can contact us to ask about access, correction, or deletion requests where applicable.',
    ],
  },
];

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Seo
        title="Privacy Policy"
        description="Privacy Policy for Status 200."
        canonicalPath="/privacy-policy"
      />
      <Navbar />
      <main className="flex-1">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 shadow-sm mb-5">
              <ShieldCheck className="w-4 h-4" />
              Privacy Policy
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              This policy explains how Status 200 handles information when you use the portfolio builder and public
              portfolio pages.
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Last updated: August 22, 2026
            </p>

            <div className="mt-10 space-y-6">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm"
                >
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}

              <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 dark:text-white">
                  Contact us
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  If you have questions about this policy or your data, contact us through the support channel provided
                  in the app or reach out via the contact details listed on the site.
                </p>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  This page is a general template and should be reviewed by legal counsel before production use.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
