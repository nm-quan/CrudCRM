'use client';
import { motion } from "framer-motion";
import { CRMClientsTable } from './CRMClientsTable';

export function FuturisticPerformancePage() {
  return (
    <div className="space-y-8 relative">
      {/* CRM Clients Table - Main Focus Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <CRMClientsTable />
      </motion.div>
    </div>
  );
}