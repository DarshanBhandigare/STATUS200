import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/common/Seo';

const sections = [
  {
    title: 'Acceptance of terms',
    body: [
      'By accessing or using Status-200, you agree to these Terms of Service and any additional policies we post.',
      'If you do not agree, do not use the service.',
    ],
  },
  {
    title: 'Eligibility and account use',
    body: [
      'You are responsible for the information you submit and for keeping your account credentials secure.',
      'You must provide accurate information and not impersonate others or misuse the platform.',
    ],
  },
  {
    title: 'User content',
    body: [
      'You retain ownership of content you submit, but you grant us the rights necessary to host, display, and operate your portfolio.',
      'You are responsible for ensuring that your content does not infringe the rights of others or violate applicable law.',
    ],
  },
  {
    title: 'Acceptable use',
    body: [
      'Do not use the service to publish unlawful, harmful, abusive, deceptive, or malicious content.',
      'Do not attempt to bypass security, reverse engineer the service, or interfere with platform operations.',
    ],
  },
  {
    title: 'Payments and subscriptions',
    body: [
      'Some features may require payment. Payment terms, pricing, and refund handling will be shown at the point of purchase.',
      'If you use a paid feature, you agree to provide accurate billing information and authorize the applicable charges.',
    ],
  },
  {
    title: 'Termination',
    body: [
      'We may suspend or terminate access if we believe you have violated these terms, abused the service, or created risk for other users.',
      'You may stop using the service at any time.',
    ],
  },
  {
    title: 'Disclaimers and liability',
    body: [
      'The service is provided on an "as is" and "as available" basis.',
      'To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.',
    ],
  },
];

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Seo
        title="Terms of Service"
        description="Terms of Service for Status-200."
        canonicalPath="/terms-of-service"
      />
      <Navbar />
      <main className="flex-1">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-sky-600 dark:text-sky-400 shadow-sm mb-5">
              <FileText className="w-4 h-4" />
              Terms of Service
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              These terms explain the rules for using Status-200, including account access, user content, and paid
              features.
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
                  Changes to these terms
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  We may update these terms from time to time. If we make material changes, we may notify you through
                  the product or by another reasonable method.
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
