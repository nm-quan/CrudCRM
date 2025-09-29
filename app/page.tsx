'use client';

import { Navbar } from '../components/FirstPage/navbar';
import { HeroSection } from '../components/FirstPage/hero-section';
import { TimelineSection } from '../components/FirstPage/timeline-section';
import { AIInsightsSection } from '../components/FirstPage/ai-insights-section';
import { CTASection } from '../components/FirstPage/cta-section';

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
