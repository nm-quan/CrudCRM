"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ResolutionRateChart } from "../../components/dashboard/ResolutionRateChart";
import { MergeChart } from "../../components/dashboard/MergeChart";
import { EscalationRateChart } from "../../components/dashboard/EscalationRateChart";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { ProblemList } from "../../components/dashboard/ProblemList";
import { FollowUpScoresChart } from "../../components/dashboard/FollowUpScoresChart";
import { FollowUpResponseChart } from "../../components/dashboard/FollowUpResponseChart";
import { ThemeProvider } from "../../components/dashboard/ThemeProvider";
import { Navbar } from "../../components/dashboard/Navbar";



export default function App() {
  const [currentSection, setCurrentSection] = useState('performance');

  const renderPerformanceSection = () => (
    <div className="space-y-6">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Cost"
          value={45678.90}
          type="currency"
          change="+12.5%"
          changeType="increase"
        />
        <MetricCard 
          title="First Response Time"
          value={2.4}
          type="time"
          suffix="hours"
          change="-8.3%"
          changeType="decrease"
        />
        <MetricCard 
          title="Conversion Rate"
          value={34.7}
          type="percentage"
          change="+5.2%"
          changeType="increase"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResolutionRateChart />
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground">Escalation Rate</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <EscalationRateChart />
          </CardContent>
        </Card>
      </div>

      {/* Full Width Chart */}
      <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-foreground">Retention vs AI Involvement</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <MergeChart />
        </CardContent>
      </Card>
    </div>
  );

  const renderIdentificationsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem List - Left Half */}
        <ProblemList />

        {/* Follow-up Metrics - Right Half */}
        <div className="space-y-6">
          {/* Follow-up Scores Chart */}
          <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground">Follow-up Scores</CardTitle>
              <p className="text-sm text-muted-foreground">Customer satisfaction scores for follow-up interactions</p>
            </CardHeader>
            <CardContent className="relative z-10">
              <FollowUpScoresChart />
            </CardContent>
          </Card>

          {/* Follow-up Response Chart */}
          <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground">Unresolved Follow-ups</CardTitle>
              <p className="text-sm text-muted-foreground">Number of follow-up responses without resolution</p>
            </CardHeader>
            <CardContent className="relative z-10">
              <FollowUpResponseChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <Card className="bg-card backdrop-blur-xl border border-card-border shadow-2xl hover:shadow-primary/20 hover:border-card-glow transition-all duration-500 hover:scale-[1.01] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-card-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-foreground">Data Analytics</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-muted-foreground">Data analytics and insights will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'performance':
        return renderPerformanceSection();
      case 'identifications':
        return renderIdentificationsSection();
      case 'data':
        return renderDataSection();
      default:
        return renderPerformanceSection();
    }
  };

  return (

      <div className="demo-page min-h-screen bg-background">
        <Navbar 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection} 
        />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Dashboard Content */}
            {renderCurrentSection()}
          </div>
        </div>
      </div>

  );
}