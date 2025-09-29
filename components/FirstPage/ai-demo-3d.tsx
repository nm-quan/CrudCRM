'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function AIDemo3D() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const demoSteps = [
    { title: 'Data Collection', description: 'Gathering customer interactions' },
    { title: 'Pattern Analysis', description: 'AI identifies behavioral patterns' },
    { title: 'Insight Generation', description: 'Creating actionable intelligence' },
    { title: 'Predictive Modeling', description: 'Forecasting customer needs' }
  ];

  // Pre-calculate orbital positions to ensure consistency
  const orbitalPositions = Array.from({ length: 6 }, (_, i) => ({
    x: Math.cos((i * 60) * Math.PI / 180) * 80 - 8,
    y: Math.sin((i * 60) * Math.PI / 180) * 80 - 8,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isPlaying && isClient) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isClient, demoSteps.length]);

  if (!isClient) {
    return (
      <Card className="relative w-full h-[500px] bg-gradient-to-br from-background to-muted border-border rounded-2xl overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-foreground to-primary rounded-full flex items-center justify-center shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full h-[500px] bg-gradient-to-br from-background to-muted border-border rounded-2xl overflow-hidden">
      {/* 3D Visualization Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Neural Network Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central Node */}
          <motion.div
            className="relative"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-foreground to-primary rounded-full flex items-center justify-center shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full" />
            </div>
            
            {/* Orbiting Nodes */}
            {orbitalPositions.map((position, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-accent rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{
                  rotate: isPlaying ? [0, 360] : 0,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "linear",
                    delay: i * 0.5
                  },
                  scale: {
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.3
                  }
                }}
                initial={{
                  x: position.x,
                  y: position.y,
                }}
              />
            ))}
          </motion.div>

          {/* Data Flow Lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute w-px bg-gradient-to-t from-transparent via-accent to-transparent"
              style={{
                height: '200px',
                left: '50%',
                top: '50%',
                transformOrigin: '0 -100px',
                transform: `rotate(${i * 45}deg)`,
              }}
              animate={{
                opacity: isPlaying ? [0, 1, 0] : 0.3,
              }}
              transition={{
                duration: 3,
                repeat: isPlaying ? Infinity : 0,
                delay: i * 0.3
              }}
            />
          ))}

          {/* Floating Data Points */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`point-${i}`}
              className="absolute w-2 h-2 bg-secondary rounded-full"
              style={{
                left: `${20 + (i * 7) % 60}%`,
                top: `${20 + (i * 11) % 60}%`,
              }}
              animate={{
                y: isPlaying ? [-10, 10, -10] : 0,
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: isPlaying ? Infinity : 0,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Step Information Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-foreground">Step {currentStep + 1}/4</h4>
              <div className="flex gap-1">
                {demoSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentStep ? 'bg-foreground' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-foreground mb-1">{demoSteps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{demoSteps[currentStep].description}</p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 p-0 bg-card/80 backdrop-blur-sm border-border"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(0)}
            className="w-10 h-10 p-0 bg-card/80 backdrop-blur-sm border-border"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-card/80 backdrop-blur-sm border-border"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Demo Label */}
        <div className="absolute top-4 left-4">
          <div className="bg-foreground/80 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-background text-sm">Live Demo</span>
          </div>
        </div>
      </div>
    </Card>
  );
}