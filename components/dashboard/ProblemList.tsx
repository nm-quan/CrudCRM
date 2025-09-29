import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const problemData = [
  { id: 1, problem: "Login Authentication Issues", count: 342, severity: "high" },
  { id: 2, problem: "Payment Processing Errors", count: 287, severity: "critical" },
  { id: 3, problem: "Email Delivery Failures", count: 156, severity: "medium" },
  { id: 4, problem: "Database Connection Timeouts", count: 124, severity: "high" },
  { id: 5, problem: "UI/UX Navigation Problems", count: 89, severity: "low" }
];

export function ProblemList() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-foreground">Top 5 Problems</CardTitle>
        <p className="text-sm text-muted-foreground">Most reported issues by customer count</p>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {problemData.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50 hover:border-card-glow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group/item relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-card-glow/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center space-x-4 relative z-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm shadow-lg border border-primary/30">
                  {index + 1}
                </div>
                <div>
                  <p className="text-foreground font-medium">{item.problem}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-white ${getSeverityColor(item.severity)} shadow-lg border border-white/20`}>
                      {item.severity}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-xl text-foreground font-light">{item.count}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">affected users</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}