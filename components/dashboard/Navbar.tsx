import { User, Sun, Moon, Monitor, ChevronDown, BarChart3, Search, Database, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from './ThemeProvider';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';

interface NavbarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Navbar({ currentSection, onSectionChange }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  const sections = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'identifications', label: 'Identifications', icon: Search },
    { id: 'data', label: 'Data', icon: Database },
  ];

  const currentSectionData = sections.find(s => s.id === currentSection);
  const CurrentIcon = currentSectionData?.icon || BarChart3;

  // Get the appropriate icon for the current theme
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <nav className="bg-card/30 border-b border-card-border px-6 py-4 sticky top-0 z-50 backdrop-blur-xl shadow-2xl supports-[backdrop-filter]:bg-card/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-card-glow/5 via-transparent to-card-glow/5" />
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Logo/Brand and Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Image alt="logo" src="/l3.png" width={50} height={50}/>
            <h1 className="text-foreground">Tribe</h1>
          </div>
          
          {/* Section Dropdown Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <CurrentIcon className="h-4 w-4" />
                <span>{currentSectionData?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <DropdownMenuItem
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={`flex items-center space-x-2 cursor-pointer ${
                      currentSection === section.id ? 'bg-accent' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side - Theme Toggle and User */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
              >
                <ThemeIcon className="h-5 w-5" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:block">
            <p className="text-sm text-foreground">Minh Quan</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}