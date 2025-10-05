import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', critical: 45, high: 32, medium: 28, low: 15 },
  { month: 'Feb', critical: 52, high: 28, medium: 35, low: 18 },
  { month: 'Mar', critical: 38, high: 45, medium: 42, low: 22 },
  { month: 'Apr', critical: 65, high: 38, medium: 38, low: 25 },
  { month: 'May', critical: 42, high: 55, medium: 45, low: 28 },
  { month: 'Jun', critical: 58, high: 42, medium: 52, low: 32 }
];

export function MultiColorThreatChart() {
  const { theme } = useTheme();

  const getTooltipStyle = () => {
    return {
      backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
      border: `1px solid ${theme === 'light' ? 'rgba(210, 180, 140, 0.3)' : 'rgba(253, 224, 71, 0.3)'}`,
      borderRadius: '8px',
      color: theme === 'light' ? '#1a1a1a' : '#ffffff'
    };
  };

  const getGridColor = () => {
    return theme === 'light' ? 'rgba(210, 180, 140, 0.2)' : 'rgba(253, 224, 71, 0.2)';
  };

  const getAxisColor = () => {
    return theme === 'light' ? '#6B7280' : '#9CA3AF';
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
          <XAxis 
            dataKey="month" 
            stroke={getAxisColor()}
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke={getAxisColor()}
            fontSize={12}
            fontFamily="monospace"
          />
          <Tooltip 
            contentStyle={getTooltipStyle()}
            labelStyle={{ color: theme === 'light' ? '#1a1a1a' : '#ffffff', fontFamily: 'monospace' }}
            formatter={(value: number, name: string) => [value, name.toUpperCase()]}
          />
          <Area
            type="monotone"
            dataKey="low"
            stackId="1"
            stroke="#22c55e"
            fill="url(#lowGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="medium"
            stackId="1"
            stroke="#eab308"
            fill="url(#mediumGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="high"
            stackId="1"
            stroke="#f97316"
            fill="url(#highGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="critical"
            stackId="1"
            stroke="#ef4444"
            fill="url(#criticalGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}