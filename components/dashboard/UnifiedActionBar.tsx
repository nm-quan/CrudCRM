import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, BarChart3, PieChart, LineChart, Activity, TrendingUp, Database } from "lucide-react";
import { useTheme } from './ThemeProvider';

const createOptions = [
  { id: 'graph', label: 'Graph', icon: LineChart },
  { id: 'chart', label: 'Chart', icon: BarChart3 },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'metrics', label: 'Metrics', icon: PieChart },
];

const widgetOptions = [
  { id: 'line-chart', label: 'Line Chart', icon: LineChart, category: 'Charts' },
  { id: 'bar-chart', label: 'Bar Chart', icon: BarChart3, category: 'Charts' },
  { id: 'pie-chart', label: 'Pie Chart', icon: PieChart, category: 'Charts' },
  { id: 'metrics', label: 'Metrics Card', icon: Activity, category: 'Widgets' },
  { id: 'trends', label: 'Trend Analysis', icon: TrendingUp, category: 'Analytics' },
];

export function UnifiedActionBar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme } = useTheme();

  const getAccentColor = () => theme === 'light' ? '#D2B48C' : '#FDE047';
  const getAccentColorRgb = () => theme === 'light' ? '210, 180, 140' : '253, 224, 71';

  const filteredWidgets = widgetOptions.filter(widget =>
    widget.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showSearchDropdown = isSearchFocused && (searchTerm.length > 0 || filteredWidgets.length > 0);

  return (
    <div className="relative w-full">
      {/* Main Unified Bar */}
      <div className="relative">
        {/* Shadow Background Layer */}
        <div 
          className="absolute inset-0 rounded-3xl transition-all duration-500 ease-out"
          style={{
            background: theme === 'light' 
              ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.06), rgba(210, 180, 140, 0.02))'
              : 'linear-gradient(135deg, rgba(253, 224, 71, 0.08), rgba(253, 224, 71, 0.02))',
            boxShadow: (isCreateOpen || isSearchFocused)
              ? `0 8px 24px rgba(${getAccentColorRgb()}, 0.12), 
                 0 0 0 1px rgba(${getAccentColorRgb()}, 0.1) inset`
              : `0 4px 16px rgba(${getAccentColorRgb()}, 0.08), 
                 0 0 0 1px rgba(${getAccentColorRgb()}, 0.06) inset`,
            filter: 'blur(0px)',
          }}
        />
        
        {/* Content Layer */}
        <div 
          className="relative rounded-3xl backdrop-blur-xl transition-all duration-500 ease-out overflow-hidden"
          style={{
            background: theme === 'light'
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
              : 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.85))',
            border: `1px solid rgba(${getAccentColorRgb()}, ${(isCreateOpen || isSearchFocused) ? '0.25' : '0.15'})`,
            boxShadow: `0 2px 8px rgba(${getAccentColorRgb()}, 0.08), 
                       0 0 0 1px rgba(${getAccentColorRgb()}, 0.06) inset`,
          }}
        >
          <div className="flex items-center">
            {/* Create New Button Section */}
            <motion.button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="relative group px-6 py-4 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderRight: `1px solid rgba(${getAccentColorRgb()}, 0.2)`,
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isCreateOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Plus 
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: getAccentColor() }}
                  />
                </motion.div>
                <span 
                  className="font-mono whitespace-nowrap transition-colors duration-300"
                  style={{ 
                    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                  }}
                >
                  CREATE NEW
                </span>
              </div>
              
              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, rgba(${getAccentColorRgb()}, 0.05), transparent)`,
                }}
              />
            </motion.button>

            {/* Vertical Separator Line with Glow */}
            <div className="relative h-8 w-px">
              <div 
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: `linear-gradient(180deg, transparent, rgba(${getAccentColorRgb()}, 0.2), transparent)`,
                  boxShadow: (isCreateOpen || isSearchFocused) 
                    ? `0 0 4px rgba(${getAccentColorRgb()}, 0.3)` 
                    : 'none',
                }}
              />
            </div>

            {/* Search Section */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <Search 
                className="w-5 h-5 transition-all duration-300 flex-shrink-0"
                style={{ 
                  color: isSearchFocused ? getAccentColor() : (theme === 'light' ? '#6B7280' : '#9CA3AF')
                }}
              />
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground transition-colors duration-300"
                style={{ 
                  color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                }}
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  <span className="text-xl">×</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Animated Glow Border */}
          <AnimatePresence>
            {(isCreateOpen || isSearchFocused) && (
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: `linear-gradient(135deg, rgba(${getAccentColorRgb()}, 0.05), rgba(${getAccentColorRgb()}, 0.02))`,
                  filter: 'blur(2px)',
                  zIndex: -1,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create New Dropdown */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full mt-3 left-0 z-50"
          >
            {/* Shadow Background */}
            <div 
              className="absolute inset-0 rounded-2xl -z-10"
              style={{
                background: theme === 'light' 
                  ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.06), rgba(210, 180, 140, 0.02))'
                  : 'linear-gradient(135deg, rgba(253, 224, 71, 0.08), rgba(253, 224, 71, 0.02))',
                boxShadow: `0 8px 24px rgba(${getAccentColorRgb()}, 0.12), 
                           0 0 0 1px rgba(${getAccentColorRgb()}, 0.06) inset`,
                filter: 'blur(4px)',
                transform: 'scale(1.01)',
              }}
            />
            
            {/* Menu Content */}
            <div 
              className="min-w-[240px] p-2 rounded-2xl backdrop-blur-xl"
              style={{
                background: theme === 'light'
                  ? 'rgba(255, 255, 255, 0.98)'
                  : 'rgba(20, 20, 20, 0.98)',
                border: `1px solid rgba(${getAccentColorRgb()}, 0.2)`,
              }}
            >
              {createOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setIsCreateOpen(false);
                      console.log('Create:', option.id);
                    }}
                    className="w-full px-4 py-3 rounded-xl transition-all duration-300 group/item"
                    style={{
                      background: 'transparent',
                    }}
                    whileHover={{
                      background: theme === 'light'
                        ? 'rgba(210, 180, 140, 0.1)'
                        : 'rgba(253, 224, 71, 0.1)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        className="w-4 h-4 transition-all duration-300"
                        style={{ 
                          color: theme === 'light' ? '#6B7280' : '#9CA3AF',
                        }}
                      />
                      <span 
                        className="font-mono text-sm transition-colors duration-300"
                        style={{ 
                          color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showSearchDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full mt-3 right-0 left-0 z-50"
          >
            {/* Shadow Background */}
            <div 
              className="absolute inset-0 rounded-2xl -z-10"
              style={{
                background: theme === 'light' 
                  ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.06), rgba(210, 180, 140, 0.02))'
                  : 'linear-gradient(135deg, rgba(253, 224, 71, 0.08), rgba(253, 224, 71, 0.02))',
                boxShadow: `0 8px 24px rgba(${getAccentColorRgb()}, 0.12), 
                           0 0 0 1px rgba(${getAccentColorRgb()}, 0.06) inset`,
                filter: 'blur(4px)',
                transform: 'scale(1.01)',
              }}
            />
            
            {/* Dropdown Content */}
            <div 
              className="max-h-96 overflow-y-auto p-2 rounded-2xl backdrop-blur-xl"
              style={{
                background: theme === 'light'
                  ? 'rgba(255, 255, 255, 0.98)'
                  : 'rgba(20, 20, 20, 0.98)',
                border: `1px solid rgba(${getAccentColorRgb()}, 0.2)`,
              }}
            >
              {filteredWidgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredWidgets.map((widget, index) => {
                    const Icon = widget.icon;
                    return (
                      <motion.button
                        key={widget.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          setSearchTerm('');
                          console.log('Add widget:', widget.id);
                        }}
                        className="px-4 py-3 rounded-xl transition-all duration-300 group/item text-left"
                        style={{
                          background: 'transparent',
                        }}
                        whileHover={{
                          background: theme === 'light'
                            ? 'rgba(210, 180, 140, 0.1)'
                            : 'rgba(253, 224, 71, 0.1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon 
                            className="w-4 h-4 flex-shrink-0 transition-all duration-300"
                            style={{ 
                              color: theme === 'light' ? '#6B7280' : '#9CA3AF',
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-mono text-sm transition-colors duration-300 truncate"
                              style={{ 
                                color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                              }}
                            >
                              {widget.label}
                            </div>
                            <div 
                              className="text-xs transition-colors duration-300 truncate"
                              style={{ 
                                color: theme === 'light' ? '#6B7280' : '#9CA3AF',
                              }}
                            >
                              {widget.category}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p 
                    className="text-sm font-mono"
                    style={{ 
                      color: theme === 'light' ? '#6B7280' : '#9CA3AF',
                    }}
                  >
                    No widgets found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Outside to Close */}
      {(isCreateOpen || showSearchDropdown) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsCreateOpen(false);
            setIsSearchFocused(false);
          }}
        />
      )}
    </div>
  );
}
