'use client';

import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Star, Quote, Sparkles, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const cardColors = [
  {
    background: "linear-gradient(135deg, #ff6b35 0%, #f4511e 100%)", 
    borderTop: "#ff6b35",
    borderBottom: "#f4511e",
    text: "#ffffff",
    accent: "#ff8a65",
  },
  {
    background: "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)", 
    borderTop: "#ec407a", 
    borderBottom: "#d81b60",
    text: "#ffffff",
    accent: "#f06292",
  },
  {
    background: "linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)", 
    borderTop: "#ffa726",
    borderBottom: "#fb8c00",
    text: "#1a1a1a",
    accent: "#ffb74d",
  },
  {
    background: "linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%)", 
    borderTop: "#8d6e63",
    borderBottom: "#6d4c41",
    text: "#ffffff", 
    accent: "#a1887f",
  },
  {
    background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)", 
    borderTop: "#e0e0e0",
    borderBottom: "#bdbdbd",
    text: "#1a1a1a",
    accent: "#9e9e9e",
  },
  {
    background: "linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)", 
    borderTop: "#5c6bc0",
    borderBottom: "#3949ab",
    text: "#ffffff",
    accent: "#7986cb",
  }
];

const testimonies = [
  {
    name: "Sarah Chen",
    position: "Head of Customer Success",
    company: "TechFlow Solutions",
    rating: 5,
    content: "AIAgent transformed how we understand our customers. We went from guessing to knowing exactly what our users need. The insights are incredibly accurate and actionable.",
    avatar: "SC",
    industry: "SaaS",
    improvement: "+47% Customer Satisfaction"
  },
  {
    name: "Marcus Rodriguez", 
    position: "VP of Marketing",
    company: "GrowthLabs",
    rating: 5,
    content: "The predictive analytics helped us reduce churn by 60%. We can now identify at-risk customers weeks before they would have left and take proactive action.",
    avatar: "MR",
    industry: "E-commerce",
    improvement: "+60% Retention Rate"
  },
  {
    name: "Jennifer Walsh",
    position: "Customer Experience Director", 
    company: "FinanceFirst",
    rating: 5,
    content: "Real-time sentiment analysis changed everything. We can resolve issues before they escalate and our NPS score has increased dramatically.",
    avatar: "JW",
    industry: "FinTech",
    improvement: "+35 NPS Score"
  },
  {
    name: "David Kim",
    position: "CEO",
    company: "StartupScale",
    rating: 5,
    content: "As a growing startup, understanding our customers is crucial. AIAgent gives us enterprise-level insights that help us compete with much larger companies.",
    avatar: "DK", 
    industry: "Startup",
    improvement: "+200% User Engagement"
  },
  {
    name: "Lisa Thompson",
    position: "Chief Data Officer",
    company: "RetailMax",
    rating: 5,
    content: "The automated segmentation and personalization recommendations have increased our conversion rates significantly. It's like having a customer psychology expert on our team.",
    avatar: "LT",
    industry: "Retail",
    improvement: "+89% Conversion Rate"
  },
  {
    name: "Alex Morrison",
    position: "Product Manager",
    company: "CloudSync",
    rating: 5,
    content: "We launched three new features based on AIAgent insights and they all exceeded adoption targets. The customer behavior predictions are incredibly precise.",
    avatar: "AM",
    industry: "Cloud Services", 
    improvement: "+150% Feature Adoption"
  }
];

export function TestimonySection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (expandedCard !== null) {
        setExpandedCard(null);
      }
    };

    if (expandedCard !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [expandedCard]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden isolate"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 overflow-visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
         
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Success Stories</span>
          </motion.div>
          
          <motion.h2 
            className="text-xl md:text-5xl mb-6 bg-gradient-to-r pb-4 from-foreground via-primary to-foreground bg-clip-text text-transparent "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            
          >
            Trusted by Industry Leaders
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            See how companies across industries use AIAgent to transform their customer understanding 
            and drive unprecedented growth.
          </motion.p>
        </motion.div>

        {/* Expanded Card Overlay */}
        {expandedCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setExpandedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const testimony = testimonies[expandedCard];
                const cardColor = cardColors[expandedCard % cardColors.length];
                return (
                  <div 
                    className="relative p-12 rounded-3xl backdrop-blur-xl border-4"
                    style={{
                      background: cardColor.background,
                      borderColor: cardColor.borderTop,
                      color: cardColor.text,
                    }}
                  >
                    <button
                      onClick={() => setExpandedCard(null)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-2xl opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
                      style={{ 
                        backgroundColor: `${cardColor.accent}60`, 
                        color: cardColor.text,
                        border: `2px solid ${cardColor.text}30`
                      }}
                    >
                      ×
                    </button>

                    <Quote 
                      className="w-20 h-20 mb-8 opacity-60" 
                      style={{ color: cardColor.text }}
                    />

                    <div className="flex gap-2 mb-8">
                      {[...Array(testimony.rating)].map((_, i) => (
                        <Star 
                          key={i}
                          className="w-7 h-7" 
                          style={{ 
                            fill: cardColor.text, 
                            color: cardColor.text,
                            opacity: 0.9
                          }} 
                        />
                      ))}
                    </div>

                    <p 
                      className="text-2xl mb-12 leading-relaxed"
                      style={{ 
                        color: cardColor.text,
                        textShadow: cardColor.text === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {`"${testimony.content}"`}
                    </p>

                    <div className="flex items-center gap-6">
                      <div 
                        className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl border-3"
                        style={{
                          backgroundColor: `${cardColor.text}15`,
                          color: cardColor.text,
                          border: `3px solid ${cardColor.text}40`
                        }}
                      >
                        {testimony.avatar}
                      </div>
                      <div>
                        <h3 
                          className="text-2xl mb-2"
                          style={{ color: cardColor.text }}
                        >
                          {testimony.name}
                        </h3>
                        <p 
                          className="text-lg opacity-80 mb-1"
                          style={{ color: cardColor.text }}
                        >
                          {testimony.position}
                        </p>
                        <p 
                          className="text-lg opacity-80 mb-4"
                          style={{ color: cardColor.text }}
                        >
                          {testimony.company}
                        </p>
                        <Badge 
                          className="text-base px-4 py-2"
                          style={{
                            backgroundColor: `${cardColor.text}20`,
                            color: cardColor.text,
                            border: `1px solid ${cardColor.text}40`
                          }}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {testimony.improvement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}

        {/* Testimonies in 3 Rows */}
        <div className="space-y-12 overflow-visible">
          {[0, 1, 2].map((rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {testimonies.slice(rowIndex * 2, rowIndex * 2 + 2).map((testimony, cardIndex) => {
                const index = rowIndex * 2 + cardIndex;
                const cardColor = cardColors[index % cardColors.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ 
                      opacity: 0,
                      y: 50,
                      scale: 0.95
                    }}
                    whileInView={{ 
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: cardIndex * 0.1,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setExpandedCard(index)}
                    whileHover={{
                      scale: 1.02,
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      transformOrigin: "center center",
                      zIndex: hoveredCard === index ? 10 : 1,
                      position: 'relative'
                    }}
                    className="group cursor-pointer"
                  >
                    <div 
                      className="relative h-full p-8 rounded-3xl backdrop-blur-sm overflow-hidden transition-all duration-300 min-h-[420px] flex flex-col"
                      style={{
                        background: cardColor.background,
                        borderTop: `4px solid ${cardColor.borderTop}`,
                        borderBottom: `4px solid ${cardColor.borderBottom}`,
                        borderLeft: `1px solid ${cardColor.borderTop}40`,
                        borderRight: `1px solid ${cardColor.borderBottom}40`,
                        color: cardColor.text,
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 opacity-30"
                        style={{ 
                          background: `linear-gradient(90deg, transparent, ${cardColor.borderTop}, transparent)`
                        }}
                      />

                      {/* Header section */}
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <Quote 
                          className="w-10 h-10 opacity-70 transition-transform duration-300 group-hover:scale-110" 
                          style={{ 
                            color: cardColor.text,
                            filter: `drop-shadow(0 2px 4px ${cardColor.text}20)`
                          }}
                        />
                        <Badge 
                          variant="outline" 
                          className="border-0 text-xs"
                          style={{ 
                            backgroundColor: `${cardColor.text}20`,
                            color: cardColor.text,
                            fontWeight: 500
                          }}
                        >
                          {testimony.industry}
                        </Badge>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-5 relative z-10">
                        {[...Array(testimony.rating)].map((_, i) => (
                          <Star 
                            key={i}
                            className="w-5 h-5 transition-transform duration-200 hover:scale-125" 
                            style={{ 
                              fill: cardColor.text, 
                              color: cardColor.text,
                              opacity: 0.9
                            }} 
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p 
                        className="mb-6 leading-relaxed relative z-10 flex-grow"
                        style={{ 
                          color: cardColor.text,
                          textShadow: cardColor.text === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                          fontSize: '0.95rem',
                          fontWeight: 400
                        }}
                      >
                          {`"${testimony.content}"`}
                      </p>

                      {/* Improvement badge */}
                      <div className="mb-6 relative z-10 mt-auto">
                        <Badge 
                          className="border-0 text-xs inline-flex items-center gap-1 transition-transform duration-200 hover:scale-105"
                          style={{
                            backgroundColor: `${cardColor.text}25`,
                            color: cardColor.text,
                            fontWeight: 500,
                            padding: '0.5rem 0.75rem'
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {testimony.improvement}
                        </Badge>
                      </div>

                      {/* Author section */}
                      <div className="flex items-center gap-4 relative z-10">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${cardColor.text}15`,
                            color: cardColor.text,
                            border: `2px solid ${cardColor.text}30`,
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          {testimony.avatar}
                        </div>
                        <div>
                          <h4 
                            className="mb-0.5"
                            style={{ 
                              color: cardColor.text,
                              fontSize: '1rem',
                              fontWeight: 500
                            }}
                          >
                            {testimony.name}
                          </h4>
                          <p 
                            className="text-sm opacity-85"
                            style={{ color: cardColor.text }}
                          >
                            {testimony.position}
                          </p>
                          <p 
                            className="text-sm opacity-85"
                            style={{ color: cardColor.text }}
                          >
                            {testimony.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        
      </div>
    </section>
  );
}