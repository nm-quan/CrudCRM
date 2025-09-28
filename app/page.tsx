'use client';

import { Navbar } from '../components/navbar';
import { HeroSection } from '../components/hero-section';
import { TimelineSection } from '../components/timeline-section';
import { AIInsightsSection } from '../components/ai-insights-section';
import { CTASection } from '../components/cta-section';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <AIInsightsSection />
      <CTASection />
    </div>
  );
}
