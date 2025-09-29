import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', score: 7.8 },
  { month: 'Feb', score: 8.1 },
  { month: 'Mar', score: 7.9 },
  { month: 'Apr', score: 8.4 },
  { month: 'May', score: 8.7 },
  { month: 'Jun', score: 8.9 },
  { month: 'Jul', score: 9.1 },
  { month: 'Aug', score: 8.8 },
  { month: 'Sep', score: 9.3 },
  { month: 'Oct', score: 9.0 },
  { month: 'Nov', score: 9.4 },
  { month: 'Dec', score: 9.6 }
];

export function FollowUpScoresChart() {
  const { theme } = useTheme();
  
  const getAccentColor = () => {
    return theme === 'light' ? '#D2B48C' : '#FDE047'; // beige for light, yellow for dark
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

  return (
    <div className="h-64">
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
            domain={[7, 10]}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip 
            contentStyle={getTooltipStyle()}
            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
            formatter={(value: number) => [value.toFixed(1), 'Follow-up Score']}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke={getAccentColor()}
            strokeWidth={2}
            dot={{ fill: getAccentColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: getAccentColor() }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}