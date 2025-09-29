import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { category: 'Product Issues', unresolved: 45 },
  { category: 'Account Problems', unresolved: 32 },
  { category: 'Billing Queries', unresolved: 28 },
  { category: 'Technical Support', unresolved: 67 },
  { category: 'Feature Requests', unresolved: 23 },
  { category: 'General Inquiry', unresolved: 19 }
];

export function FollowUpResponseChart() {
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
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
          <XAxis 
            dataKey="category" 
            stroke={getAxisColor()}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke={getAxisColor()}
            fontSize={12}
          />
          <Tooltip 
            contentStyle={getTooltipStyle()}
            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
            formatter={(value: number) => [value, 'Unresolved Follow-ups']}
          />
          <Bar 
            dataKey="unresolved" 
            fill={getAccentColor()}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}