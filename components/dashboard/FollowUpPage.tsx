import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  User, 
  Hash,
  Bold,
  Italic,
  Underline,
  List,
  Send,
  Sparkles,
  MessageCircle,
  CheckSquare,
  Square,
  Mail,
  Users,
  Plus
} from 'lucide-react';

// Expanded problem data with multiple people affected
const problemData = [
  {
    id: 1,
    name: "AUTH_TIMEOUT",
    severity: "critical",
    count: 23,
    trend: "up",
    description: "Authentication timeout errors increasing",
    category: "Security",
    assignee: "Sarah Chen",
    date: "2024-01-15",
    impact: "High - Affects 45% of active users",
    affectedUsers: ["John Doe", "Sarah Johnson", "Mike Wilson", "Lisa Park", "David Kim"]
  },
  {
    id: 2,
    name: "DATA_SYNC_FAIL",
    severity: "high",
    count: 15,
    trend: "down",
    description: "Data synchronization failures",
    category: "Data",
    assignee: "Mike Rodriguez", 
    date: "2024-01-14",
    impact: "Medium - 12% sync failure rate",
    affectedUsers: ["Michael Chen", "Emily Rodriguez", "James Wilson"]
  },
  {
    id: 3,
    name: "UI_RENDER_LAG",
    severity: "medium",
    count: 8,
    trend: "stable",
    description: "User interface rendering delays",
    category: "Frontend",
    assignee: "Lisa Wang",
    date: "2024-01-13", 
    impact: "Low - User experience degradation",
    affectedUsers: ["Emily Rodriguez", "Anna Kumar", "Tom Bradley"]
  },
  {
    id: 4,
    name: "API_RATE_LIMIT",
    severity: "low",
    count: 3,
    trend: "down",
    description: "API rate limit warnings",
    category: "Integration",
    assignee: "David Kumar",
    date: "2024-01-12",
    impact: "Very Low - Minor service alerts",
    affectedUsers: ["David Thompson", "Lisa Chen"]
  },
  {
    id: 5,
    name: "CACHE_MISS",
    severity: "medium",
    count: 12,
    trend: "up",
    description: "Cache miss ratio elevated",
    category: "Performance",
    assignee: "Emma Thompson",
    date: "2024-01-11",
    impact: "Medium - Performance degradation",
    affectedUsers: ["Lisa Park", "Robert Taylor", "Jennifer Lee", "Alex Morgan"]
  },
  {
    id: 6,
    name: "EMAIL_DELIVERY_FAIL",
    severity: "high",
    count: 18,
    trend: "up",
    description: "Email notifications failing to deliver",
    category: "Communication",
    assignee: "Chris Anderson",
    date: "2024-01-16",
    impact: "High - Business communication disrupted",
    affectedUsers: ["Sarah Johnson", "Mike Wilson", "Jennifer Smith", "Paul Rodriguez"]
  },
  {
    id: 7,
    name: "PAYMENT_GATEWAY_ERROR",
    severity: "critical",
    count: 31,
    trend: "up",
    description: "Payment processing failures causing transaction errors",
    category: "Financial",
    assignee: "Jessica Martinez",
    date: "2024-01-17",
    impact: "Critical - Revenue loss potential",
    affectedUsers: ["Michael Chen", "Lisa Park", "David Thompson", "Emily Rodriguez", "James Wilson", "Anna Kumar"]
  },
  {
    id: 8,
    name: "MOBILE_APP_CRASH",
    severity: "high",
    count: 22,
    trend: "stable",
    description: "Mobile application crashes on specific device models",
    category: "Mobile",
    assignee: "Tony Lee",
    date: "2024-01-16",
    impact: "High - Mobile user base affected",
    affectedUsers: ["Tom Bradley", "Jennifer Lee", "Alex Morgan", "Paul Rodriguez"]
  }
];

// Customer review data that appears when clicking on problems
const customerReviewData = [
  // AUTH_TIMEOUT reviews
  {
    id: 1,
    name: "Sarah Johnson",
    duration: "2h 15m",
    content: "Experienced authentication timeouts repeatedly. Very frustrating when trying to access important client data during peak hours.",
    spreadScore: 3.5,
    resolved: false,
    email: "sarah.j@company.com",
    phone: "+1-555-0123",
    category: "Authentication Issues"
  },
  {
    id: 1,
    name: "John Doe",
    duration: "1h 45m",
    content: "Authentication keeps timing out during important client meetings. This is becoming a major productivity blocker.",
    spreadScore: 2.8,
    resolved: false,
    email: "john.doe@business.com",
    phone: "+1-555-0891",
    category: "Authentication Issues"
  },
  // DATA_SYNC_FAIL reviews
  {
    id: 2,
    name: "Michael Chen",
    duration: "45m",
    content: "Data sync issues causing discrepancies in reports. Need this resolved urgently for quarterly review.",
    spreadScore: 5.2,
    resolved: true,
    email: "m.chen@enterprise.co",
    phone: "+1-555-0184",
    category: "Data Synchronization"
  },
  {
    id: 2,
    name: "James Wilson",
    duration: "2h 10m",
    content: "Critical data not syncing properly between systems. Financial reports are showing inconsistent numbers.",
    spreadScore: 3.1,
    resolved: false,
    email: "j.wilson@finance.com",
    phone: "+1-555-0267",
    category: "Data Synchronization"
  },
  // UI_RENDER_LAG reviews
  {
    id: 3,
    name: "Emily Rodriguez",
    duration: "3h 20m",
    content: "UI is extremely slow to load, especially on mobile devices. This is affecting our field team productivity.",
    spreadScore: 4.8,
    resolved: true,
    email: "emily.r@startup.io",
    phone: "+1-555-0156",
    category: "Performance Issues"
  },
  // API_RATE_LIMIT reviews
  {
    id: 4,
    name: "David Thompson",
    duration: "30m",
    content: "Getting rate limit warnings but not sure if it's affecting actual functionality. Need clarification.",
    spreadScore: 7.2,
    resolved: false,
    email: "d.thompson@corp.com", 
    phone: "+1-555-0198",
    category: "API Limitations"
  },
  // CACHE_MISS reviews
  {
    id: 5,
    name: "Lisa Park",
    duration: "1h 30m",
    content: "Cache issues are causing slow page loads and data refresh problems. Impact on user experience is significant.",
    spreadScore: 4.1,
    resolved: true,
    email: "lisa.p@design.agency",
    phone: "+1-555-0167",
    category: "Caching Problems"
  },
  // EMAIL_DELIVERY_FAIL reviews
  {
    id: 6,
    name: "Paul Rodriguez",
    duration: "1h 15m",
    content: "Important notifications are not being delivered. Missing critical updates about system changes.",
    spreadScore: 3.8,
    resolved: false,
    email: "p.rodriguez@notifications.com",
    phone: "+1-555-0445",
    category: "Email Delivery"
  },
  // PAYMENT_GATEWAY_ERROR reviews
  {
    id: 7,
    name: "Michael Chen",
    duration: "3h 45m",
    content: "Payment processing is completely broken. Unable to complete any transactions for our customers.",
    spreadScore: 1.2,
    resolved: false,
    email: "m.chen@payments.com",
    phone: "+1-555-0932",
    category: "Payment Processing"
  },
  {
    id: 7,
    name: "David Thompson",
    duration: "2h 30m",
    content: "Critical payment gateway errors causing revenue loss. Customers cannot complete purchases.",
    spreadScore: 1.8,
    resolved: false,
    email: "d.thompson@ecommerce.com",
    phone: "+1-555-0876",
    category: "Payment Processing"
  },
  // MOBILE_APP_CRASH reviews
  {
    id: 8,
    name: "Jennifer Lee",
    duration: "1h 20m",
    content: "Mobile app crashes consistently on Android devices. Unable to access any functionality on mobile.",
    spreadScore: 2.5,
    resolved: false,
    email: "j.lee@mobile.com",
    phone: "+1-555-0654",
    category: "Mobile Application"
  }
];

export function FollowUpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [contextUsers, setContextUsers] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  // Group users by problem categories
  const usersByCategory = problemData.reduce((acc, problem) => {
    const categoryUsers = problem.affectedUsers.map(user => ({
      name: user,
      problemId: problem.id,
      problemName: problem.name,
      severity: problem.severity,
      category: problem.category,
      assignee: problem.assignee,
      date: problem.date,
      description: problem.description,
      email: customerReviewData.find(review => review.name === user && review.id === problem.id)?.email || `${user.toLowerCase().replace(' ', '.')}@company.com`,
      phone: customerReviewData.find(review => review.name === user && review.id === problem.id)?.phone || `+1-555-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`
    }));

    if (!acc[problem.category]) {
      acc[problem.category] = {
        problemName: problem.name,
        severity: problem.severity,
        count: problem.count,
        trend: problem.trend,
        users: []
      };
    }
    acc[problem.category].users.push(...categoryUsers);
    return acc;
  }, {} as Record<string, any>);

  // Update output text in real-time as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    setOutputText(newText); // Mirror input to output in real-time
  };

  const handleRefineByAI = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const refinedText = `**AI-Enhanced Follow-up:**

**Problem Analysis:**
${inputText}

**Recommended Actions:**
• **Immediate Steps:** Investigate root cause and implement temporary workaround
• **Timeline:** Target resolution within 24-48 hours
• **Resources:** Assign senior developer and escalate to infrastructure team
• **Communication:** Update stakeholders every 4 hours until resolved

**Risk Assessment:**
- **Business Impact:** High - potential revenue loss if not addressed quickly
- **Technical Risk:** Medium - may require system downtime for permanent fix
- **User Impact:** Critical - affects core functionality

**Next Steps:**
1. Schedule emergency meeting with technical leads
2. Prepare rollback plan if primary solution fails
3. Monitor system metrics closely during implementation
4. Document lessons learned for future prevention`;

      setOutputText(refinedText);
      setIsProcessing(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!outputText.trim()) return;
    
    const recipients = contextUsers.length > 0 ? contextUsers : selectedUsers;
    const message = recipients.length > 0 
      ? `Follow-up sent successfully to ${recipients.length} users: ${recipients.join(', ')}`
      : 'Follow-up sent successfully!';
    
    alert(message);
    setInputText('');
    setOutputText('');
    setSelectedUsers([]);
    setContextUsers([]);
    setIsMultiSelectMode(false);
  };

  const handleUserClick = (userName: string) => {
    if (isMultiSelectMode) {
      toggleUserSelection(userName);
    }
  };

  const toggleUserSelection = (userName: string) => {
    setSelectedUsers(prev => 
      prev.includes(userName) 
        ? prev.filter(name => name !== userName)
        : [...prev, userName]
    );
  };

  const handleMassSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (!isMultiSelectMode) {
      setSelectedUsers([]);
    }
  };

  const handleAddContext = () => {
    // Add selected users to context list
    const newContextUsers = [...contextUsers];
    selectedUsers.forEach(user => {
      if (!newContextUsers.includes(user)) {
        newContextUsers.push(user);
      }
    });
    setContextUsers(newContextUsers);
    setSelectedUsers([]);
    setIsMultiSelectMode(false);
  };

  const removeContextUser = (userName: string) => {
    setContextUsers(prev => prev.filter(name => name !== userName));
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('follow-up-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    
    if (selectedText) {
      let formattedText = selectedText;
      
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'h1':
          formattedText = `# ${selectedText}`;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          break;
        case 'list':
          formattedText = `• ${selectedText}`;
          break;
      }
      
      const newText = inputText.substring(0, start) + formattedText + inputText.substring(end);
      setInputText(newText);
      setOutputText(newText);
    }
  };

  return (
   <div className=" bg-background px-8 py-6 ">
  <div className="grid grid-cols-[1.1fr,1.3fr] gap-8 h-[calc(100vh-3rem)]">
        
        {/* Left Side - Category/User List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/20 backdrop-blur-xl border border-card-border relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedCategory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="mr-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-foreground font-mono">
                    {selectedCategory ? `${selectedCategory.toUpperCase()} USERS` : 'PROBLEM CATEGORIES'}
                  </h2>
                </div>
                
                {selectedCategory && (
                  <div className="flex items-center gap-2">
                    {isMultiSelectMode && selectedUsers.length > 0 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleAddContext}
                          className="text-xs font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Context ({selectedUsers.length})
                        </Button>
                        <span className="text-xs font-mono text-primary">
                          {selectedUsers.length} selected
                        </span>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMassSelect}
                      className={`text-xs font-mono ${isMultiSelectMode ? 'bg-primary/20 text-primary' : 'hover:bg-card/30'}`}
                    >
                      {isMultiSelectMode ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Exit Multi-Select
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 mr-1" />
                          Multi-Select
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {!selectedCategory ? (
                  // Category View - Big Buttons
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {Object.entries(usersByCategory).map(([category, categoryData], index) => (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedCategory(category)}
                        className="w-full p-6 bg-card/30 rounded-xl border border-border/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Hash className="w-5 h-5 text-primary" />
                            <h3 className="font-mono text-lg text-foreground">{category.toUpperCase()}</h3>
                          </div>
                          <Badge className={`${getSeverityColor(categoryData.severity)} font-mono text-xs`}>
                            {categoryData.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-muted-foreground">
                            {categoryData.users.length} affected users
                          </span>
                          <span className={`text-sm font-mono ${getTrendColor(categoryData.trend)}`}>
                            {categoryData.trend === 'up' ? '↗' : categoryData.trend === 'down' ? '↘' : '→'} {categoryData.count}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  // User List View
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {usersByCategory[selectedCategory]?.users.map((user: any, index: number) => {
                      const isSelected = selectedUsers.includes(user.name);
                      return (
                        <motion.div
                          key={`${user.name}-${user.problemId}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleUserClick(user.name)}
                          className={`p-4 bg-card/20 rounded-lg border cursor-pointer transition-all duration-300 ${
                            isSelected && isMultiSelectMode 
                              ? 'border-primary/50 bg-primary/10' 
                              : 'border-border/20 hover:bg-card/40 hover:border-primary/20'
                          } ${!isMultiSelectMode ? 'cursor-default' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {isMultiSelectMode && (
                                <div className="w-4 h-4 flex items-center justify-center">
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Square className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                              <div>
                                <h4 className="font-mono text-sm text-foreground">{user.name}</h4>
                                <p className="text-xs font-mono text-muted-foreground">{user.email}</p>
                                <p className="text-xs font-mono text-muted-foreground">{user.phone}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <User className="w-3 h-3" />
                                {user.assignee}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3" />
                                {user.date}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Rich Text Editor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/20 backdrop-blur-xl border border-card-border relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-primary" />
                <h2 className="text-foreground font-mono">FOLLOW-UP COMPOSER</h2>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
              {/* Context Users */}
              {contextUsers.length > 0 && (
                <div className="mb-4">
                  <Label className="text-foreground font-mono text-sm mb-2 block">
                    CONTEXT USERS ({contextUsers.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {contextUsers.map((user) => (
                      <motion.div
                        key={user}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-xs border border-primary/30"
                      >
                        <span>{user}</span>
                        <button
                          onClick={() => removeContextUser(user)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-card/20 rounded-lg border border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('bold')}
                  className="w-8 h-8 p-0 hover:bg-card/30"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('italic')}
                  className="w-8 h-8 p-0 hover:bg-card/30"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('underline')}
                  className="w-8 h-8 p-0 hover:bg-card/30"
                >
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border/30 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('list')}
                  className="w-8 h-8 p-0 hover:bg-card/30"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Input Section */}
              <div className="mb-4">
                <Label htmlFor="follow-up-input" className="text-foreground font-mono text-sm mb-2 block bg-black">
                  INPUT MESSAGE
                </Label>
                <Textarea
                  id="follow-up-input"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Enter your follow-up message here..."
                  className="h-32 bg-input/10 border-border/30 resize-none font-mono text-sm"
                />
              </div>

              {/* Output Section */}
              <div className="flex-1 mb-4">
                <Label className="text-foreground font-mono text-sm mb-2 block">
                  OUTPUT PREVIEW
                </Label>
                <div className="h-full bg-input/10 border border-border/30 rounded-lg p-4 overflow-y-auto font-mono text-sm min-h-[200px]">
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      AI is refining your message...
                    </div>
                  ) : outputText ? (
                    <div className="whitespace-pre-wrap text-foreground">{outputText}</div>
                  ) : (
                    <div className="text-muted-foreground">
                      Your message will appear here as you type...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleRefineByAI}
                  disabled={!inputText.trim() || isProcessing}
                  className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-mono"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refine by AI
                </Button>
                
                <Button
                  onClick={handleSend}
                  disabled={!outputText.trim()}
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-mono"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {contextUsers.length > 0 ? `Send to ${contextUsers.length} Users` : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}