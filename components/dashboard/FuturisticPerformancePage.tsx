import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { MergedResolutionEscalationChart } from './MergedResolutionEscalationChart';

import { MetricCard } from './MetricCard';
import { UnifiedActionBar } from './UnifiedActionBar';
import { CRMClientsTable } from './CRMClientsTable';
import { Activity, BarChart3, Clock, DollarSign, Target } from "lucide-react";
import SubscriptionsTable from './table';

export function FuturisticPerformancePage() {
  const { theme } = useTheme();
  const [scanAnimation, setScanAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAnimation(true);
      setTimeout(() => setScanAnimation(false), 2000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const getAccentColor = () => theme === 'light' ? '#D2B48C' : '#FDE047';
  const getAccentColorRgb = () => theme === 'light' ? '210, 180, 140' : '253, 224, 71';

  return (
    <div className="space-y-8 relative">
      {/* Scanning Animation Overlay */}
      <AnimatePresence>
        {scanAnimation && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.2 }}
            exit={{ scaleY: 0, opacity: 0 }}
            className="fixed inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${getAccentColor()}40 50%, transparent 100%)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Unified Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <UnifiedActionBar />
      </motion.div>

      {/* CRM Clients Table - SPOTLIGHT - Main Focus Component */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-12"
      >
        <CRMClientsTable />
      </motion.div>



      {/* Performance Metrics Row - Secondary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: theme === 'light' 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.02))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.03))',
              boxShadow: `0 8px 32px rgba(34, 197, 94, 0.1)`,
              filter: 'blur(2px)',
            }}
          />
          <MetricCard 
            title="Cost Efficiency"
            value={45678.90}
            type="currency"
            change="+12.5%"
            changeType="increase"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        <div className="relative">
          <div 
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: theme === 'light' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.03))',
              boxShadow: `0 8px 32px rgba(59, 130, 246, 0.1)`,
              filter: 'blur(2px)',
            }}
          />
          <MetricCard 
            title="First Response Time"
            value={2.4}
            type="time"
            suffix="hours"
            change="-8.3%"
            changeType="decrease"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        <div className="relative">
          <div 
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: theme === 'light' 
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(168, 85, 247, 0.02))'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.03))',
              boxShadow: `0 8px 32px rgba(168, 85, 247, 0.1)`,
              filter: 'blur(2px)',
            }}
          />
          <MetricCard 
            title="Customer Satisfaction"
            value={94.2}
            type="percentage"
            change="+2.8%"
            changeType="increase"
            icon={<Target className="w-5 h-5" />}
          />
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Resolution & Escalation Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex"
        >
          <div className="relative flex-1">
            <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-red-500/5" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="text-foreground font-mono">RESOLUTION & ESCALATION</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                </div>
                
                <div className="flex-1">
                  <MergedResolutionEscalationChart />
                </div>
                
                {/* Chart Legend/Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-card/20 rounded-xl border border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm" />
                      <span className="text-xs font-mono text-muted-foreground">AVG RESOLUTION</span>
                    </div>
                    <div className="text-lg font-mono text-foreground mt-1">91.2%</div>
                  </div>
                  <div className="p-3 bg-card/20 rounded-xl border border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-sm" />
                      <span className="text-xs font-mono text-muted-foreground">AVG ESCALATION</span>
                    </div>
                    <div className="text-lg font-mono text-foreground mt-1">8.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
      

    </div>
  );
}