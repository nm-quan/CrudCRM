import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', retentionRate: 78.5, aiInvolvement: 45.2 },
  { month: 'Feb', retentionRate: 79.2, aiInvolvement: 47.8 },
  { month: 'Mar', retentionRate: 81.1, aiInvolvement: 52.3 },
  { month: 'Apr', retentionRate: 82.7, aiInvolvement: 55.9 },
  { month: 'May', retentionRate: 84.3, aiInvolvement: 58.4 },
  { month: 'Jun', retentionRate: 85.8, aiInvolvement: 61.7 },
  { month: 'Jul', retentionRate: 87.2, aiInvolvement: 64.2 },
  { month: 'Aug', retentionRate: 88.9, aiInvolvement: 67.8 },
  { month: 'Sep', retentionRate: 90.1, aiInvolvement: 70.3 },
  { month: 'Oct', retentionRate: 91.4, aiInvolvement: 73.1 },
  { month: 'Nov', retentionRate: 92.7, aiInvolvement: 75.8 },
  { month: 'Dec', retentionRate: 94.2, aiInvolvement: 78.5 }
];

export function MergeChart() {
  const { theme } = useTheme();
  
  const getAccentColor = () => {
    return theme === 'light' ? '#D2B48C' : '#FDE047'; // beige for light, yellow for dark
  };

  const getSecondaryColor = () => {
    return theme === 'light' ? '#8B7355' : '#FFFFFF'; // darker beige for light, white for dark
  };

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

  const getLegendColor = () => {
    return theme === 'light' ? '#111827' : '#F9FAFB';
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            formatter={(value: number, name: string) => [
              `${value}%`, 
              name === 'retentionRate' ? 'Retention Rate' : 'AI Involvement'
            ]}
          />
          <Legend 
            wrapperStyle={{ color: getLegendColor() }}
            formatter={(value) => value === 'retentionRate' ? 'Retention Rate' : 'AI Involvement'}
          />
          <Line 
            type="monotone" 
            dataKey="retentionRate" 
            stroke={getAccentColor()}
            strokeWidth={2}
            dot={{ fill: getAccentColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: getAccentColor() }}
          />
          <Line 
            type="monotone" 
            dataKey="aiInvolvement" 
            stroke={getSecondaryColor()}
            strokeWidth={2}
            dot={{ fill: getSecondaryColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: getSecondaryColor() }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}