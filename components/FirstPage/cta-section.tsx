'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "Advanced AI",
    description: "State-of-the-art machine learning models"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and data protection"
  },
  {
    icon: Zap,
    title: "Rapid Deployment",
    description: "Go live in weeks, not months"
  }
];

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-t from-black via-neutral-900 to-stone-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-white via-stone-200 to-stone-300 bg-clip-text text-transparent">
            Ready to Transform Your Customer Intelligence?
          </h2>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Join forward-thinking companies already leveraging AI agents to build deeper, 
            more meaningful customer relationships.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center bg-gradient-to-br from-stone-800/60 to-black/60 border-stone-700/50 backdrop-blur-sm hover:border-gray-500/30 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500/20 to-stone-600/20 flex items-center justify-center border border-gray-500/30">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-white mb-2">{feature.title}</h3>
                  <p className="text-stone-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-stone-800/80 to-black/80 border-stone-700/50 backdrop-blur-sm">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl text-white">
                  Start Your AI Agent Journey Today
                </h3>
                <p className="text-stone-300 max-w-2xl mx-auto">
                  Get started with a personalized demo and see how AI agents can transform 
                  your customer understanding in just 30 days.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm group"
                >
                  Start Building Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-stone-600 text-stone-300 hover:bg-stone-800/50 px-8 py-4 rounded-2xl backdrop-blur-sm"
                >
                  Schedule Demo
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-stone-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stone-400 rounded-full" />
                  30-day free trial
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full" />
                  Setup in 15 minutes
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}