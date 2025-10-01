'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import Image from 'next/image';

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Analytics', href: '#analytics' },
  { name: 'Pricing', href: '#pricing' },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <Image alt="logo" src="/l3.png" width={50} height={50}/>
            <span className="text-xl text-foreground">Tribe</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl">
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}