'use client';

import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';

const timelineItems = [
  {
    phase: "Foundation",
    duration: "Months 1-3",
    title: "Data Collection & Initial Training",
    description: "Establish data pipelines and begin training AI agents on your customer interactions.",
    icon: Clock,
    status: "active"
  },
  {
    phase: "Learning",
    duration: "Months 4-8", 
    title: "Pattern Recognition & Adaptation",
    description: "AI agents learn customer behavior patterns and begin making intelligent recommendations.",
    icon: TrendingUp,
    status: "upcoming"
  },
  {
    phase: "Intelligence",
    duration: "Months 9-12",
    title: "Predictive Customer Insights",
    description: "Advanced understanding enables proactive customer engagement and personalized experiences.",
    icon: Zap,
    status: "future"
  },
  {
    phase: "Mastery",
    duration: "Year 2+",
    title: "Autonomous Customer Success",
    description: "AI agents autonomously deliver exceptional customer experiences with minimal oversight.",
    icon: CheckCircle,
    status: "future"
  }
];

export function TimelineSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-muted/30 to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text mb-6 ">
            Why Long-Term Investment Matters
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI agents require time to truly understand your customers. Our phased approach ensures 
            sustainable growth and increasingly intelligent automation.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-secondary opacity-60" />
          
          <div className="space-y-8">
            {timelineItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm ${
                      item.status === 'active' 
                        ? 'bg-gradient-to-br from-accent to-primary shadow-lg' 
                        : 'bg-gradient-to-br from-secondary to-muted border border-border'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        item.status === 'active' ? 'text-background' : 'text-muted-foreground'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <Card className="p-6 bg-gradient-to-br from-card/80 to-background/80 border-border backdrop-blur-sm hover:border-accent/30 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              item.status === 'active'
                                ? 'bg-accent/20 text-foreground border border-accent/30'
                                : 'bg-muted/50 text-muted-foreground border border-border'
                            }`}>
                              {item.phase}
                            </span>
                            <span className="text-muted-foreground text-sm">{item.duration}</span>
                          </div>
                          <h3 className="text-xl text-foreground mb-2">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}