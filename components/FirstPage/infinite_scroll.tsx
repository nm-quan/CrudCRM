'use client';

import { motion } from 'framer-motion';

export function InfiniteScrollSection() {
  const scrollItems = Array(10).fill("Be Our First Customer");

  return (
    <section className="py-16 bg-gradient-to-r from-background via-muted/10 to-background overflow-hidden">
      <div className="relative">
        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-2">
            Ready to Pioneer the Future?
          </h3>
          <p className="text-muted-foreground">Join us in shaping the next generation of AI-powered customer understanding</p>
        </div>

        {/* First row - moving left to right */}
        <div className="flex whitespace-nowrap mb-6">
          <motion.div
            className="flex gap-6 items-center"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...scrollItems, ...scrollItems].map((text, index) => (
              <div 
                key={`row1-${index}`}
                className="flex-shrink-0 px-8 py-4 bg-gradient-to-r from-foreground to-accent text-background rounded-2xl shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                <span className="text-lg font-medium whitespace-nowrap">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row - moving right to left */}
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex gap-6 items-center"
            animate={{
              x: ["-50%", "0%"]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...scrollItems, ...scrollItems].map((text, index) => (
              <div 
                key={`row2-${index}`}
                className="flex-shrink-0 px-8 py-4 bg-gradient-to-r from-card/90 to-background/90 rounded-2xl border-2 border-border hover:border-accent/50 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <span className="text-lg font-medium text-foreground whitespace-nowrap">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10" />
      </div>
    </section>
  );
}