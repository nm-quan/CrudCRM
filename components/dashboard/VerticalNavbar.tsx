"use client";


import { useState } from 'react';
import { motion } from "framer-motion";
import { BarChart3, Search, MessageCircle, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/button';

interface VerticalNavbarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function VerticalNavbar({ currentSection, onSectionChange }: VerticalNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sections = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'identifications', label: 'Identifications', icon: Search },
    { id: 'followup', label: 'Follow-Up', icon: MessageCircle },
  ];

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-card/40 backdrop-blur-xl border-r border-card-border shadow-2xl z-50 flex flex-col">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card-glow/10 via-transparent to-card-glow/10" />
      <div className="absolute right-0 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo/Brand Area */}
        <div className="p-4 border-b border-card-border/50">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <span className="text-primary font-mono text-lg">T</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center py-6 space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            
            return (
              <motion.div
                key={section.id}
                className="relative"
                onHoverStart={() => setHoveredItem(section.id)}
                onHoverEnd={() => setHoveredItem(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                      : 'hover:bg-card/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Button>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -right-6 top-1/2 w-1 h-8 bg-primary rounded-full"
                    style={{ transform: 'translateY(-50%)' }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Tooltip */}
                {hoveredItem === section.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50"
                  >
                    <div className="bg-card/90 backdrop-blur-md border border-card-border rounded-lg px-3 py-2 text-sm font-mono text-foreground shadow-xl">
                      {section.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card/90 border-l border-b border-card-border rotate-45" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Settings and Theme Toggle at bottom */}
        <div className="flex flex-col items-center space-y-4 p-4 border-t border-card-border/50">
          {/* Theme Toggle */}
          <motion.div
            className="relative"
            onHoverStart={() => setHoveredItem('theme')}
            onHoverEnd={() => setHoveredItem(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-12 h-12 rounded-xl hover:bg-card/30 text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {/* Theme Toggle Tooltip */}
            {hoveredItem === 'theme' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50"
              >
                <div className="bg-card/90 backdrop-blur-md border border-card-border rounded-lg px-3 py-2 text-sm font-mono text-foreground shadow-xl">
                  Toggle Theme
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card/90 border-l border-b border-card-border rotate-45" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Settings */}
          <motion.div
            className="relative"
            onHoverStart={() => setHoveredItem('settings')}
            onHoverEnd={() => setHoveredItem(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSectionChange('settings')}
              className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                currentSection === 'settings'
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                  : 'hover:bg-card/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Settings Active Indicator */}
            {currentSection === 'settings' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -right-6 top-1/2 w-1 h-8 bg-primary rounded-full"
                style={{ transform: 'translateY(-50%)' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Settings Tooltip */}
            {hoveredItem === 'settings' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50"
              >
                <div className="bg-card/90 backdrop-blur-md border border-card-border rounded-lg px-3 py-2 text-sm font-mono text-foreground shadow-xl">
                  Settings
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card/90 border-l border-b border-card-border rotate-45" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}