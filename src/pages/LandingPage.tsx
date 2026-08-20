import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/features/landing/HeroSection';
import { SocialProof } from '@/features/landing/SocialProof';
import { FeaturesGrid } from '@/features/landing/FeaturesGrid';
import { HowItWorks } from '@/features/landing/HowItWorks';
import { TemplatesPreview } from '@/features/landing/TemplatesPreview';
import { PricingSection } from '@/features/landing/PricingSection';
import { CTASection } from '@/features/landing/CTASection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SocialProof />
        <FeaturesGrid />
        <HowItWorks />
        <TemplatesPreview />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
