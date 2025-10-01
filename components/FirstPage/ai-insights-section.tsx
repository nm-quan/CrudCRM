'use client';

import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, Users, BarChart3, MessageSquare, Target, Lightbulb, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const insightCards = [
  {
    icon: Brain,
    title: "Behavioral Analysis",
    metric: "94% Accuracy",
    description: "Deep learning models analyze customer interaction patterns to predict preferences and needs.",
    dataPoints: ["Purchase timing", "Communication style", "Feature usage"]
  },
  {
    icon: Users,
    title: "Segment Intelligence", 
    metric: "12 Auto-Segments",
    description: "AI automatically identifies and creates customer segments based on behavior and engagement.",
    dataPoints: ["High-value users", "At-risk customers", "Growth opportunities"]
  },
  {
    icon: MessageSquare,
    title: "Sentiment Tracking",
    metric: "Real-time",
    description: "Natural language processing monitors customer sentiment across all touchpoints.",
    dataPoints: ["Support conversations", "Product feedback", "Social mentions"]
  },
  {
    icon: Target,
    title: "Predictive Engagement",
    metric: "3x Higher CTR",
    description: "AI agents predict optimal timing and messaging for customer outreach.",
    dataPoints: ["Best contact times", "Message personalization", "Channel preferences"]
  }
];

// Resolution percentage data
const resolutionData = [
  { month: 'Jan', rate: 72 },
  { month: 'Feb', rate: 76 },
  { month: 'Mar', rate: 81 },
  { month: 'Apr', rate: 85 },
  { month: 'May', rate: 89 },
  { month: 'Jun', rate: 92 }
];

// AI Involvement data
const aiInvolvementData = [
  { name: 'Human Only', value: 25, color: '#9ca38c' },
  { name: 'AI Assisted', value: 45, color: '#737373' },
  { name: 'AI Automated', value: 30, color: '#1a1a1a' }
];

// AI Growth Rate data
const growthData = [
  { quarter: 'Q1', efficiency: 15, accuracy: 12, speed: 18 },
  { quarter: 'Q2', efficiency: 28, accuracy: 25, speed: 32 },
  { quarter: 'Q3', efficiency: 42, accuracy: 38, speed: 45 },
  { quarter: 'Q4', efficiency: 58, accuracy: 52, speed: 61 }
];

// ROI data
const roiData = [
  { month: 'Jan', roi: 120 },
  { month: 'Feb', roi: 135 },
  { month: 'Mar', roi: 152 },
  { month: 'Apr', roi: 168 },
  { month: 'May', roi: 185 },
  { month: 'Jun', roi: 203 }
];

export function AIInsightsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-secondary/30 to-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent pb-4">
            How AI Agents Improve Customer Understanding
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI agents continuously learn and adapt, building deeper customer insights 
            that drive meaningful business outcomes.
          </p>
        </motion.div>

        {/* AI Performance Charts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resolution Percentage Chart */}
            <Card className="p-6 bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50  backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-accent" />
                <h3 className="text-lg text-black">Resolution Percentage</h3>
                <Badge className="bg-gray-100 text-gray-800 border-border">92%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={resolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Area type="monotone" dataKey="rate" stroke="hsl(var(--foreground))" fill="hsl(var(--muted))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* AI Involvement Chart */}
            <Card className="p-6 bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg text-black">AI Involvement</h3>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">75%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={aiInvolvementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {aiInvolvementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #d6d3d1',
                      borderRadius: '8px',
                      color: '#1a1a1a'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {aiInvolvementData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Growth Rate Chart */}
            <Card className="p-6 bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg text-black">AI Rate of Growth</h3>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">+58%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
                  <XAxis dataKey="quarter" stroke="#78716c" />
                  <YAxis stroke="#78716c" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #d6d3d1',
                      borderRadius: '8px',
                      color: '#1a1a1a'
                    }} 
                  />
                  <Bar dataKey="efficiency" fill="#1a1a1a" />
                  <Bar dataKey="accuracy" fill="#525252" />
                  <Bar dataKey="speed" fill="#9ca38c" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* ROI Chart */}
            <Card className="p-6 bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg text-black">Return on Investment</h3>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">203%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
                  <XAxis dataKey="month" stroke="#78716c" />
                  <YAxis stroke="#78716c" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #d6d3d1',
                      borderRadius: '8px',
                      color: '#1a1a1a'
                    }} 
                  />
                  <Line type="monotone" dataKey="roi" stroke="#1a1a1a" strokeWidth={3} dot={{ fill: '#1a1a1a', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </motion.div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insightCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50 backdrop-blur-sm hover:border-gray-500/30 transition-all duration-300 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500/20 to-stone-600/20 flex items-center justify-center border border-gray-500/30 group-hover:border-gray-400/50 transition-all duration-300">
                      <Icon className="w-6 h-6 text-gray-600 group-hover:text-gray-500 transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg text-black">{card.title}</h3>
                        <Badge className="bg-gradient-to-r from-gray-500/20 to-stone-600/20 text-gray-700 border-gray-500/30">
                          {card.metric}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-stone-700 mb-4 leading-relaxed">{card.description}</p>
                  
                  <div className="space-y-2">
                    <span className="text-sm text-stone-600 block">Key Data Points:</span>
                    <div className="flex flex-wrap gap-2">
                      {card.dataPoints.map((point, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs bg-stone-300/50 text-stone-700 rounded-full border border-stone-400/30"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Data Visualization Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-white/80 to-stone-50/80 border-stone-300/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-600" />
              <h3 className="text-2xl text-black">Real-Time Customer Intelligence Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700">Customer Satisfaction</span>
                  <span className="text-gray-600">↑ 23%</span>
                </div>
                <div className="h-2 bg-stone-300 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gray-500 to-gray-700 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700">Engagement Rate</span>
                  <span className="text-stone-600">↑ 31%</span>
                </div>
                <div className="h-2 bg-stone-300 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-stone-500 to-stone-700 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "65%" }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700">Prediction Accuracy</span>
                  <span className="text-black">↑ 18%</span>
                </div>
                <div className="h-2 bg-stone-300 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-black to-gray-800 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "89%" }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}