'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';

interface JobApplication {
    id: number;
    Status: string | null;
}

const supabase = createClient();

// Color palette for pie chart
const COLORS = {
    Applied: '#3b82f6',   // blue
    Interview: '#eab308', // yellow
    Offer: '#22c55e',     // green
    Rejected: '#ef4444',  // red
};

export function JobApplicationChart() {
    const { theme } = useTheme();
    const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchJobData();
    }, []);

    const fetchJobData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('job_application')
                .select('id, Status');

            if (error) {
                console.log('Supabase error, using demo data:', error.message);
                // Use demo data when table doesn't exist
                setChartData([
                    { name: 'Applied', value: 12, color: COLORS.Applied },
                    { name: 'Interview', value: 5, color: COLORS.Interview },
                    { name: 'Offer', value: 3, color: COLORS.Offer },
                    { name: 'Rejected', value: 4, color: COLORS.Rejected },
                ]);
                setTotal(24);
                return;
            }

            // Count by status
            const statusCounts: Record<string, number> = {
                Applied: 0,
                Interview: 0,
                Offer: 0,
                Rejected: 0
            };

            (data || []).forEach((job: JobApplication) => {
                const status = job.Status || 'Applied';
                if (status in statusCounts) {
                    statusCounts[status]++;
                }
            });

            // Convert to chart format
            const pieData = Object.entries(statusCounts)
                .filter(([_, count]) => count > 0)
                .map(([name, value]) => ({
                    name,
                    value,
                    color: COLORS[name as keyof typeof COLORS] || '#888'
                }));

            // If no data, show demo
            if (pieData.length === 0) {
                setChartData([
                    { name: 'Applied', value: 12, color: COLORS.Applied },
                    { name: 'Interview', value: 5, color: COLORS.Interview },
                    { name: 'Offer', value: 3, color: COLORS.Offer },
                    { name: 'Rejected', value: 4, color: COLORS.Rejected },
                ]);
                setTotal(24);
            } else {
                setChartData(pieData);
                setTotal(data?.length || 0);
            }
        } catch (err) {
            console.log('Error fetching data, using demo:', err);
            setChartData([
                { name: 'Applied', value: 12, color: COLORS.Applied },
                { name: 'Interview', value: 5, color: COLORS.Interview },
                { name: 'Offer', value: 3, color: COLORS.Offer },
                { name: 'Rejected', value: 4, color: COLORS.Rejected },
            ]);
            setTotal(24);
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-card/95 backdrop-blur-md border border-card-border rounded-lg px-4 py-3 shadow-xl">
                    <p className="font-mono text-sm font-semibold" style={{ color: data.color }}>
                        {data.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                        {data.value} applications ({Math.round((data.value / total) * 100)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
        if (percent < 0.08) return null; // Don't show label for very small slices

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-xs font-bold"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-foreground font-mono font-semibold">APPLICATION STATUS</h3>
                        <p className="text-muted-foreground text-xs font-mono mt-1">
                            {total} total applications
                        </p>
                    </div>
                    <button
                        onClick={fetchJobData}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        REFRESH
                    </button>
                </div>

                {/* Chart */}
                {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius={110}
                                    innerRadius={50}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke="transparent"
                                            style={{
                                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full shadow-lg"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs font-mono text-muted-foreground">
                                {item.name}: <span className="text-foreground font-semibold">{item.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
