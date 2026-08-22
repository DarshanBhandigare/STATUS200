import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/common/Seo';
import { HeroSection } from '@/features/landing/HeroSection';
import { SocialProof } from '@/features/landing/SocialProof';
import { FeaturesGrid } from '@/features/landing/FeaturesGrid';
import { HowItWorks } from '@/features/landing/HowItWorks';
import { TemplatesPreview } from '@/features/landing/TemplatesPreview';
import { PricingSection } from '@/features/landing/PricingSection';
import { CTASection } from '@/features/landing/CTASection';
import { FAQSection } from '@/features/landing/FAQSection';
import heroImage from '@/assets/hero.png';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      <Seo
        title="Status 200 - AI Profile Builder for Developer Portfolios"
        description="Build a developer portfolio in minutes with Status 200, an AI profile builder for students, junior developers, and freelancers."
        canonicalPath="/"
        imagePath={heroImage}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Status 200',
            url: 'https://status-200.vercel.app/',
            description:
              'AI profile builder for developer portfolios, students, junior developers, and freelancers.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is Status 200?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Status 200 is a developer portfolio builder that helps you publish a searchable public profile without writing custom code.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is Status 200 an AI profile builder?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Status 200 guides you through the information needed to create a polished AI profile builder experience for your public portfolio.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need to pay to get started?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. You can start on the free plan and publish a portfolio without paying first.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is the Pro upgrade a subscription?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. Pro is a one-time payment, so you upgrade once and keep the premium benefits without recurring billing.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I change templates later?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. You can switch between templates after creating your portfolio, and your content refits automatically.',
                },
              },
              {
                '@type': 'Question',
                name: 'How can I get my portfolio on Google?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Publish the portfolio, keep the page public, and use descriptive titles and metadata so Google can crawl and index the page.',
                },
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Status 200',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'An AI profile builder for developer portfolios that helps students and junior developers publish recruiter-ready public pages.',
            url: 'https://status-200.vercel.app/',
            offers: [
              {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                category: 'Free plan',
              },
              {
                '@type': 'Offer',
                price: '50',
                priceCurrency: 'INR',
                category: 'Pro one-time upgrade',
              },
            ],
          },
        ]}
      />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SocialProof />
        <FeaturesGrid />
        <HowItWorks />
        <TemplatesPreview />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
