'use client'
import { motion } from 'framer-motion'

export default function MotionTest() {
  return (
    <div className="p-10">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="bg-red-500 text-white p-6 rounded"
      >
        Should slide in
      </motion.div>
    </div>
  )
}
