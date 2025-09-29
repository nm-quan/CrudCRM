import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', resolutions: 1250 },
  { month: 'Feb', resolutions: 1380 },
  { month: 'Mar', resolutions: 1420 },
  { month: 'Apr', resolutions: 1650 },
  { month: 'May', resolutions: 1580 },
  { month: 'Jun', resolutions: 1720 },
  { month: 'Jul', resolutions: 1890 },
  { month: 'Aug', resolutions: 1960 },
  { month: 'Sep', resolutions: 2100 },
  { month: 'Oct', resolutions: 2280 },
  { month: 'Nov', resolutions: 2350 },
  { month: 'Dec', resolutions: 2420 }
];

export function ResolutionRateChart() {
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
          />
          <Tooltip 
            contentStyle={getTooltipStyle()}
            labelStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
          />
          <Line 
            type="monotone" 
            dataKey="resolutions" 
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