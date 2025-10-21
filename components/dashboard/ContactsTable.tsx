import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users2, Mail, Phone, Building2, Briefcase, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company: string;
}

const mockContacts: Contact[] = [
  { id: '1-1', name: 'Sarah Johnson', role: 'HR Manager', email: 'sarah.j@techinnovations.com', phone: '(555) 123-4567', company: 'Tech Innovations Inc.' },
  { id: '1-2', name: 'Mike Chen', role: 'Engineering Lead', email: 'mike.c@techinnovations.com', phone: '(555) 123-4568', company: 'Tech Innovations Inc.' },
  { id: '2-1', name: 'Emily Roberts', role: 'Design Director', email: 'emily.r@creativesolutions.com', phone: '(555) 234-5678', company: 'Creative Solutions' },
  { id: '3-1', name: 'Alex Thompson', role: 'CTO', email: 'alex.t@startuplabs.com', phone: '(555) 345-6789', company: 'StartUp Labs' },
  { id: '3-2', name: 'Jordan Lee', role: 'Recruiter', email: 'jordan.l@startuplabs.com', phone: '(555) 345-6790', company: 'StartUp Labs' },
  { id: '4-1', name: 'David Park', role: 'VP Product', email: 'david.p@enterprisecorp.com', phone: '(555) 456-7890', company: 'Enterprise Corp' },
  { id: '5-1', name: 'Lisa Wong', role: 'Tech Lead', email: 'lisa.w@digitalagency.com', phone: '(555) 567-8901', company: 'Digital Agency' },
  { id: '6-1', name: 'Robert Kim', role: 'Chief Architect', email: 'robert.k@cloudservices.com', phone: '(555) 678-9012', company: 'Cloud Services Ltd' },
  { id: '6-2', name: 'Amanda Silva', role: 'HR Business Partner', email: 'amanda.s@cloudservices.com', phone: '(555) 678-9013', company: 'Cloud Services Ltd' },
];

export function ContactsTable() {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');

  // Get unique companies
  const companies = ['all', ...Array.from(new Set(mockContacts.map(c => c.company)))];

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = filterCompany === 'all' || contact.company === filterCompany;
    
    return matchesSearch && matchesCompany;
  });

  // Get contact stats
  const totalContacts = contacts.length;
  const totalCompanies = new Set(contacts.map(c => c.company)).size;

  return (
    <div className="bg-card/10 backdrop-blur-xl border border-border/20 rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Users2 className="w-5 h-5 text-primary" />
          <h2 className="text-foreground font-mono">COMPANY CONTACTS</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-card/20 rounded-xl border border-border/30"
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">TOTAL CONTACTS</div>
            <div className="text-2xl font-mono text-foreground">{totalContacts}</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 bg-card/20 rounded-xl border border-border/30"
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">COMPANIES</div>
            <div className="text-2xl font-mono text-primary">{totalCompanies}</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/20 backdrop-blur-xl border-card-border font-mono"
            />
          </div>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[200px] bg-card/20 backdrop-blur-xl border-card-border font-mono">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company} value={company} className="font-mono">
                  {company === 'all' ? 'All Companies' : company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/30 hover:bg-card/40 border-border/30">
                <TableHead className="font-mono text-muted-foreground">NAME</TableHead>
                <TableHead className="font-mono text-muted-foreground">ROLE</TableHead>
                <TableHead className="font-mono text-muted-foreground">COMPANY</TableHead>
                <TableHead className="font-mono text-muted-foreground">EMAIL</TableHead>
                <TableHead className="font-mono text-muted-foreground">PHONE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-border/30 hover:bg-card/20 transition-colors"
                  >
                    <TableCell className="font-mono text-foreground">
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3 h-3" />
                        {contact.role}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        {contact.company}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground font-mono py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}