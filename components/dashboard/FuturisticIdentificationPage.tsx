import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { MultiColorThreatChart } from './MultiColorThreatChart';
import  CustomerReviewsTable from './CustomerReviewsTable';
import SubscriptionsTable from './table';

import { Target } from "lucide-react";

export function FuturisticIdentificationPage() {
  const { theme } = useTheme();
  const [scanAnimation, setScanAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAnimation(true);
      setTimeout(() => setScanAnimation(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getAccentColor = () => theme === 'light' ? '#D2B48C' : '#FDE047';

  return (
    <div className="space-y-8 relative">
      {/* Scanning Animation Overlay */}
      <AnimatePresence>
        {scanAnimation && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.3 }}
            exit={{ scaleY: 0, opacity: 0 }}
            className="fixed inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${getAccentColor()}40 50%, transparent 100%)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Customer Reviews Table - Main Focus */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full mb-8"
      >
        <CustomerReviewsTable />
      </motion.div>



      {/* Full Width Threat Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-mono">THREAT ANALYTICS</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  <span className="text-muted-foreground">CRITICAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                  <span className="text-muted-foreground">HIGH</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                  <span className="text-muted-foreground">MEDIUM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm" />
                  <span className="text-muted-foreground">LOW</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <MultiColorThreatChart />
      
             
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}