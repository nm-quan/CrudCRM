import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', escalationRate: 15.2 },
  { month: 'Feb', escalationRate: 14.8 },
  { month: 'Mar', escalationRate: 16.1 },
  { month: 'Apr', escalationRate: 13.5 },
  { month: 'May', escalationRate: 12.9 },
  { month: 'Jun', escalationRate: 11.4 },
  { month: 'Jul', escalationRate: 10.8 },
  { month: 'Aug', escalationRate: 9.7 },
  { month: 'Sep', escalationRate: 8.9 },
  { month: 'Oct', escalationRate: 8.2 },
  { month: 'Nov', escalationRate: 7.8 },
  { month: 'Dec', escalationRate: 7.1 }
];

export function EscalationRateChart() {
  const { theme } = useTheme();
  
  const getGridColor = () => {
    return theme === 'light' ? '#E5E7EB' : '#374151';
  };

  const getAxisColor = () => {
    return theme === 'light' ? '#6B7280' : '#9CA3AF';
  };

  const getTooltipStyle = () => {
    return {
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1F2937',
      border: `1px solid ${theme === 'light' ? '#E5E7EB' : '#374151'}`,
      borderRadius: '8px',
      color: theme === 'light' ? '#111827' : '#F9FAFB'
    };
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
          <XAxis 
            dataKey="month" 
            stroke={getAxisColor()}
            fontSize={12}
          />
          <YAxis 
            stroke={getAxisColor()}
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={getTooltipStyle()}
            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
            formatter={(value: number) => [`${value}%`, 'Escalation Rate']}
          />
          <Line 
            type="monotone" 
            dataKey="escalationRate" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#EF4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}