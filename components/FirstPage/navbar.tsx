'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';

const navItems = [
  { name: 'Solutions', href: '#features' },
  { name: 'Features', href: '#timeline' },
  { name: 'Testimonials', href: '#analytics' },
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
      <nav className="max-w-7xl mx-auto px-6 py-4 min-h-1/7 font-sans">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <span className="text-[40px] font-extrabold tracking-tight text-bg font-sans mr-10">Klano</span>

          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative font-light text-foreground transition-colors duration-200 cursor-pointer
                 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-foreground after:absolute after:bottom-0 after:left-0
                 hover:after:w-full after:transition-all after:duration-300"
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
            className="flex items-center justify-center space-x-4 
             bg-white/10 backdrop-blur-md shadow-lg rounded-3xl p-1"
          >
            {/* Sign In Button */}
            <Button
              variant="ghost"
              className="px-6 py-2 rounded-2xl font-normal hover:bg-white/20"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>

            {/* Sign Up Button */}
            <Button
              className="px-6 py-2 rounded-2xl bg-button text-foreground font-medium hover:bg-primary/90"
              onClick={() => window.location.href = '/auth'}
            >
              Sign Up
            </Button>
          </motion.div>


        </div>
      </nav>
    </motion.header>
  );
}