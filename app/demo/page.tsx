"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FuturisticPerformancePage } from "../../components/dashboard/FuturisticPerformancePage";
import { FuturisticIdentificationPage } from "../../components/dashboard/FuturisticIdentificationPage";
import { SettingsPage } from "../../components/dashboard/SettingsPage";
import { ThemeProvider } from "../../components/dashboard/ThemeProvider";
import { VerticalNavbar } from "../../components/dashboard/VerticalNavbar";

import { BarChart3, Activity, TrendingUp } from "lucide-react";

export default function App() {
  const [currentSection, setCurrentSection] = useState('performance');

  const renderDataSection = () => (
    <div className="space-y-8">
      {/* Business Intelligence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground font-mono flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              DATA PROCESSING
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">DAILY RECORDS</span>
                <span className="text-foreground font-mono">12,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">PROCESSING RATE</span>
                <span className="text-green-500 font-mono">99.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">DATA QUALITY</span>
                <span className="text-primary font-mono">A+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              SYSTEM HEALTH
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">SERVER UPTIME</span>
                <span className="text-green-500 font-mono">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">RESPONSE TIME</span>
                <span className="text-foreground font-mono">145ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">ERROR RATE</span>
                <span className="text-primary font-mono">0.03%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground font-mono flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              BUSINESS METRICS
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">REVENUE IMPACT</span>
                <span className="text-green-500 font-mono">+18.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">EFFICIENCY GAIN</span>
                <span className="text-foreground font-mono">+24.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-sm">ROI</span>
                <span className="text-primary font-mono">347%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Panel */}
      <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-foreground font-mono flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            ADVANCED BUSINESS ANALYTICS
            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-card/20 rounded-xl border border-border/30">
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground">2.8M</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">DATA POINTS ANALYZED</div>
                <div className="text-xs font-mono text-green-500 mt-2">+12.3% vs last month</div>
              </div>
            </div>
            <div className="p-4 bg-card/20 rounded-xl border border-border/30">
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground">97.2%</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">PREDICTION ACCURACY</div>
                <div className="text-xs font-mono text-green-500 mt-2">+0.8% improvement</div>
              </div>
            </div>
            <div className="p-4 bg-card/20 rounded-xl border border-border/30">
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground">847</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">ACTIVE INTEGRATIONS</div>
                <div className="text-xs font-mono text-primary mt-2">15 new this week</div>
              </div>
            </div>
            <div className="p-4 bg-card/20 rounded-xl border border-border/30">
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground">$2.4M</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">COST SAVINGS (YTD)</div>
                <div className="text-xs font-mono text-green-500 mt-2">Target: $2.1M</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'performance':
        return <FuturisticPerformancePage />;
      case 'identifications':
        return <FuturisticIdentificationPage />;
      case 'data':
        return renderDataSection();
      case 'settings':
        return <SettingsPage />;
      default:
        return <FuturisticPerformancePage />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <VerticalNavbar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />

        <div className="ml-20 min-h-screen">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Main Dashboard Content with Smooth Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {renderCurrentSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}