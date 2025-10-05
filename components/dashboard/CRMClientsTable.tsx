import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from './ThemeProvider';
import { Search, Plus, Users, Check, X, Edit3, ChevronUp, ChevronDown } from "lucide-react";

// Mock CRM data
const initialCrmClients = [
  {
    customer_id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone_number: "+1-555-0123",
    company: "TechCorp Solutions",
    status: "Active",
    last_contact_date: "2024-01-15",
    next_action: "Follow up on contract renewal"
  },
  {
    customer_id: 2,
    name: "Michael Chen",
    email: "m.chen@startup.io",
    phone_number: "+1-555-0184",
    company: "StartupFlow Inc",
    status: "Prospect",
    last_contact_date: "2024-01-14",
    next_action: "Schedule product demo"
  },
  {
    customer_id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@designstudio.co",
    phone_number: "+1-555-0156",
    company: "Creative Design Studio",
    status: "Lead",
    last_contact_date: "2024-01-13",
    next_action: "Send pricing proposal"
  },
  {
    customer_id: 4,
    name: "David Thompson",
    email: "d.thompson@manufacturing.com",
    phone_number: "+1-555-0198",
    company: "Thompson Manufacturing",
    status: "Churned",
    last_contact_date: "2023-12-20",
    next_action: "Win-back campaign outreach"
  },
  {
    customer_id: 5,
    name: "Lisa Park",
    email: "lisa.park@consulting.net",
    phone_number: "+1-555-0167",
    company: "Park Consulting Group",
    status: "Active",
    last_contact_date: "2024-01-12",
    next_action: "Quarterly business review"
  },
  {
    customer_id: 6,
    name: "James Wilson",
    email: "j.wilson@logistics.com",
    phone_number: "+1-555-0134",
    company: "Wilson Logistics",
    status: "Prospect",
    last_contact_date: "2024-01-11",
    next_action: "Technical requirements review"
  },
  {
    customer_id: 7,
    name: "Anna Kumar",
    email: "anna.k@fintech.io",
    phone_number: "+1-555-0189",
    company: "FinTech Innovations",
    status: "Lead",
    last_contact_date: "2024-01-10",
    next_action: "Compliance documentation review"
  },
  {
    customer_id: 8,
    name: "Robert Lee",
    email: "r.lee@healthcare.org",
    phone_number: "+1-555-0145",
    company: "HealthCare Partners",
    status: "Active",
    last_contact_date: "2024-01-09",
    next_action: "Implementation support check-in"
  }
];

export function CRMClientsTable() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(initialCrmClients);
  const [editingCell, setEditingCell] = useState<{clientId: number, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Prospect': return 'text-blue-400';
      case 'Lead': return 'text-primary';
      case 'Churned': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-400';
      case 'Prospect': return 'bg-blue-400';
      case 'Lead': return 'bg-primary';
      case 'Churned': return 'bg-red-400';
      default: return 'bg-muted-foreground';
    }
  };

  const filteredAndSortedClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'company':
          aValue = a.company;
          bValue = b.company;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'last_contact_date':
          aValue = new Date(a.last_contact_date).getTime();
          bValue = new Date(b.last_contact_date).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startEdit = (clientId: number, field: string, currentValue: string) => {
    setEditingCell({ clientId, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell) return;
    
    setClients(clients.map(client => 
      client.customer_id === editingCell.clientId 
        ? { ...client, [editingCell.field]: editValue }
        : client
    ));
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const renderEditableCell = (client: any, field: string, value: string, className: string = '') => {
    const isEditing = editingCell?.clientId === client.customer_id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full bg-card/50 border border-primary/50 rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <button onClick={saveEdit} className="text-green-400 hover:text-green-300 p-1">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div 
        className={`group cursor-pointer hover:bg-card/20 rounded px-2 py-1 transition-colors flex items-center gap-2 ${className}`}
        onClick={() => startEdit(client.customer_id, field, value)}
      >
        <span className="font-mono text-foreground">{value}</span>
        <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-card-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-mono">CLIENT DATABASE</h2>
              <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">
                {clients.length}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 bg-card/30 border border-border/50 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              
              {/* Add Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200">
                <Plus className="w-4 h-4" />
                ADD CLIENT
              </button>
            </div>
          </div>
        </div>

        {/* Table Container with Fixed Header */}
        <div className="relative max-h-[65vh] overflow-hidden border border-card-border/50 rounded-lg">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-20 bg-card/60 backdrop-blur-md border-b-2 border-primary/50 shadow-lg">
            <div className="grid grid-cols-5 px-6 py-4 text-xs font-mono text-primary uppercase tracking-wider">
              <button 
                onClick={() => handleSort('name')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4"
              >
                CLIENT
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <button 
                onClick={() => handleSort('company')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                COMPANY
                {sortField === 'company' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <button 
                onClick={() => handleSort('status')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                STATUS
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">CONTACT</div>
              <button 
                onClick={() => handleSort('last_contact_date')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors pl-4"
              >
                LAST CONTACT
                {sortField === 'last_contact_date' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto max-h-[calc(65vh-60px)]">
            <AnimatePresence>
              {filteredAndSortedClients.map((client, index) => (
                <motion.div
                  key={client.customer_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className={`grid grid-cols-5 px-6 py-4 text-sm border-b border-card-border/30 transition-all duration-200 ${
                    index % 2 === 0 
                      ? 'bg-card/5 hover:bg-card/15' 
                      : 'bg-card/10 hover:bg-card/20'
                  }`}
                >
                  {/* Client */}
                  <div className="flex items-center gap-3 border-r border-card-border/50 pr-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      {renderEditableCell(client, 'name', client.name)}
                      <div className="text-xs font-mono text-muted-foreground">
                        #{client.customer_id.toString().padStart(3, '0')}
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                    {renderEditableCell(client, 'company', client.company)}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 border-r border-card-border/50 pr-4 pl-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(client.status)} flex-shrink-0`} />
                    {renderEditableCell(client, 'status', client.status, `${getStatusColor(client.status)} text-xs uppercase`)}
                  </div>

                  {/* Contact */}
                  <div className="space-y-1 border-r border-card-border/50 pr-4 pl-4">
                    {renderEditableCell(client, 'email', client.email, 'text-xs')}
                    {renderEditableCell(client, 'phone_number', client.phone_number, 'text-xs text-muted-foreground')}
                  </div>

                  {/* Last Contact */}
                  <div className="flex items-center pl-4">
                    {renderEditableCell(client, 'last_contact_date', formatDate(client.last_contact_date), 'text-muted-foreground')}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-card-border/50 bg-card/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-muted-foreground">
              SHOWING {filteredAndSortedClients.length} OF {clients.length} CLIENTS
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">ACTIVE {clients.filter(c => c.status === 'Active').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-muted-foreground">PROSPECTS {clients.filter(c => c.status === 'Prospect').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">LEADS {clients.filter(c => c.status === 'Lead').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}