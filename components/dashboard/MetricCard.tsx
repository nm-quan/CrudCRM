import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface MetricCardProps {
  title: string;
  value: number;
  type: 'currency' | 'percentage' | 'time' | 'number';
  suffix?: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, type, suffix, change, changeType, icon }: MetricCardProps) {
  const { theme } = useTheme();

  const formatValue = () => {
    switch (type) {
      case 'currency':
        return `${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value}%`;
      case 'time':
        return `${value}${suffix ? ` ${suffix}` : ''}`;
      default:
        return value.toString();
    }
  };

  const getTrendColor = () => {
    if (changeType === 'increase') {
      return theme === 'light' ? 'text-primary' : 'text-yellow-300';
    }
    return 'text-green-400';
  };

  return (
    <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/30 hover:border-card-glow transition-all duration-500 hover:scale-[1.05] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-muted-foreground text-sm tracking-wide uppercase flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-foreground text-3xl font-light tracking-tight">{formatValue()}</div>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${getTrendColor()} mt-2`}>
                {changeType === 'increase' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">{change}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}