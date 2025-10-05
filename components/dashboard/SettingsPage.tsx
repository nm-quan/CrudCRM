import { motion } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Settings, User, Bell, Shield, Palette, Database, Monitor, Smartphone, LogOut } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    // Clear any stored authentication tokens/data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    
    // Show confirmation message
    alert('You have been logged out successfully.');
    
    // In a real app, you would redirect to login page
    // window.location.href = '/login';
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-foreground font-mono">SYSTEM SETTINGS</h1>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground font-mono flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                APPEARANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Dark Mode</span>
                  <p className="text-muted-foreground text-xs">Toggle between light and dark themes</p>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Animations</span>
                  <p className="text-muted-foreground text-xs">Enable smooth transitions</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Grid Background</span>
                  <p className="text-muted-foreground text-xs">Show animated grid pattern</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-2">
                <span className="text-foreground font-mono text-sm">Display Mode</span>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground font-mono flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                ACCOUNT
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <span className="text-foreground font-mono text-sm">User Information</span>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Name: John Doe</p>
                  <p className="text-muted-foreground text-xs">Role: Administrator</p>
                  <p className="text-muted-foreground text-xs">Department: IT Operations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Two-Factor Auth</span>
                  <p className="text-muted-foreground text-xs">Enhanced security</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Session Timeout</span>
                  <p className="text-muted-foreground text-xs">Auto logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Change Password
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full font-mono"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground font-mono flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                NOTIFICATIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Email Alerts</span>
                  <p className="text-muted-foreground text-xs">System status updates</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Browser Notifications</span>
                  <p className="text-muted-foreground text-xs">Real-time alerts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Performance Alerts</span>
                  <p className="text-muted-foreground text-xs">System threshold warnings</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Weekly Reports</span>
                  <p className="text-muted-foreground text-xs">Automated summary emails</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground font-mono flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                DATA & PRIVACY
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Data Collection</span>
                  <p className="text-muted-foreground text-xs">Analytics and usage data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-foreground font-mono text-sm">Auto Backup</span>
                  <p className="text-muted-foreground text-xs">Daily data backups</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <span className="text-foreground font-mono text-sm">Data Retention</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">30 Days</Button>
                  <Button variant="ghost" size="sm">90 Days</Button>
                  <Button variant="ghost" size="sm">1 Year</Button>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Export Data
                </Button>
                <Button variant="destructive" size="sm" className="w-full">
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-card/20 backdrop-blur-xl border border-card-border shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-foreground font-mono flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              SYSTEM INFORMATION
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="text-center">
                  <div className="text-2xl font-mono text-foreground">v2.4.1</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">APPLICATION VERSION</div>
                  <div className="text-xs font-mono text-green-500 mt-2">Latest</div>
                </div>
              </div>
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="text-center">
                  <div className="text-2xl font-mono text-foreground">99.9%</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">SYSTEM UPTIME</div>
                  <div className="text-xs font-mono text-green-500 mt-2">Excellent</div>
                </div>
              </div>
              <div className="p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="text-center">
                  <div className="text-2xl font-mono text-foreground">2.1GB</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">STORAGE USED</div>
                  <div className="text-xs font-mono text-primary mt-2">32% of quota</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}