import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from './ThemeProvider';

const data = [
  { month: 'Jan', resolution: 85, escalation: 15, resolved: 340, escalated: 60 },
  { month: 'Feb', resolution: 88, escalation: 12, resolved: 380, escalated: 52 },
  { month: 'Mar', resolution: 92, escalation: 8, resolved: 420, escalated: 36 },
  { month: 'Apr', resolution: 89, escalation: 11, resolved: 390, escalated: 48 },
  { month: 'May', resolution: 94, escalation: 6, resolved: 450, escalated: 28 },
  { month: 'Jun', resolution: 91, escalation: 9, resolved: 410, escalated: 40 },
  { month: 'Jul', resolution: 96, escalation: 4, resolved: 480, escalated: 20 },
];

export function MergedResolutionEscalationChart() {
  const { theme } = useTheme();

  const getAccentColor = () => theme === 'light' ? '#D2B48C' : '#FDE047';
  const getErrorColor = () => '#EF4444';
  const getSuccessColor = () => '#10B981';

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'light' ? 'rgba(210, 180, 140, 0.2)' : 'rgba(253, 224, 71, 0.2)'}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: theme === 'light' ? '#6B7280' : '#9CA3AF',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
          />
          <YAxis
            yAxisId="percentage"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: theme === 'light' ? '#6B7280' : '#9CA3AF',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            domain={[0, 100]}
          />
          <YAxis
            yAxisId="count"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: theme === 'light' ? '#6B7280' : '#9CA3AF',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.95)',
              border: `1px solid ${getAccentColor()}`,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(16px)',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            labelStyle={{
              color: theme === 'light' ? '#1a1a1a' : '#ffffff',
              fontWeight: 'bold'
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: theme === 'light' ? '#6B7280' : '#9CA3AF'
            }}
          />

          {/* Resolution Rate Line */}
          <Line
            yAxisId="percentage"
            type="monotone"
            dataKey="resolution"
            stroke={getSuccessColor()}
            strokeWidth={3}
            dot={{ fill: getSuccessColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: getSuccessColor(), strokeWidth: 2 }}
            name="Resolution Rate (%)"
          />

          {/* Escalation Rate Line */}
          <Line
            yAxisId="percentage"
            type="monotone"
            dataKey="escalation"
            stroke={getErrorColor()}
            strokeWidth={3}
            dot={{ fill: getErrorColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: getErrorColor(), strokeWidth: 2 }}
            name="Escalation Rate (%)"
          />

          {/* Resolved Count Bars */}
          <Bar
            yAxisId="count"
            dataKey="resolved"
            fill={getSuccessColor()}
            opacity={0.6}
            name="Cases Resolved"
            radius={[4, 4, 0, 0]}
          />

          {/* Escalated Count Bars */}
          <Bar
            yAxisId="count"
            dataKey="escalated"
            fill={getErrorColor()}
            opacity={0.6}
            name="Cases Escalated"
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}