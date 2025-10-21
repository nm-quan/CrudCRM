import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { MultiColorThreatChart } from './MultiColorThreatChart';
import  JobTrackingTable  from './GmailTable';
import  {ContactsTable} from './ContactsTable';

import { TrendingUp } from "lucide-react";

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

      {/* Job List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <JobTrackingTable />
      </motion.div>

      {/* Full Width Job Analytics Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="bg-card/10 backdrop-blur-xl border border-border/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-mono">JOB APPLICATION ANALYTICS</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  <span className="text-muted-foreground">REJECTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                  <span className="text-muted-foreground">APPLIED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                  <span className="text-muted-foreground">INTERVIEW</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm" />
                  <span className="text-muted-foreground">OFFER</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <MultiColorThreatChart />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Company Contacts Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ContactsTable />
      </motion.div>

    </div>
  );
}