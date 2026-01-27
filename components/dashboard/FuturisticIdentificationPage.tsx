import { motion } from "framer-motion";
import { JobApplicationChart } from './JobApplicationChart';
import { JobApplicationsTable } from './JobApplicationsTable';

import { TrendingUp } from "lucide-react";

export function FuturisticIdentificationPage() {
  return (
    <div className="space-y-8 relative">
      {/* Job Applications Table - FIRST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <JobApplicationsTable />
      </motion.div>

      {/* Job Analytics Chart - SECOND (synced with table data) */}
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
              <h2 className="text-foreground font-mono">APPLICATION TRENDS</h2>
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
            <div className="mb-2">
              <JobApplicationChart />
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}