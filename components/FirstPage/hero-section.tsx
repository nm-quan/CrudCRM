'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { AIDemo3D } from './ai-demo-3d';
import { ArrowRight, Play } from 'lucide-react';
import { InfiniteScrollSection } from './infinite_scroll';
import Link from 'next/link';





export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-muted rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-tight font-sans font-extrabold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text ">
                Take Three Minutes
              </span>
              <span className="block text-foreground mt-2">to understand your</span>
              <span className="block text-foreground">Customers.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Customizable AI Agent learns, improve, never forgets, find problems
            </motion.p>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-3"
            >
              {[
                "92% customer resolution rate",
                "203% ROI within 6 months", 
                "Real-time behavioral insights"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </motion.div>
            <Link href ="/demo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className=" bg-gray-900 text-white hover:bg-foreground/90 px-8 py-4 rounded-2xl transition-all duration-300 group"
              >
                Start Building Today
                <ArrowRight color = "white" className=" ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white border-solid  text-white bg-gray-400 hover:bg-muted px-8 py-4 rounded-2xl group"
              
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
           </Link>

    
          
        
       
  
      
          </motion.div>

          {/* Right Side - 3D Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <AIDemo3D />
      

         
          </motion.div>
        </div>
      </div>
      {/* Infinite Scroll Section */}
      <InfiniteScrollSection />
    </section>
  );
}