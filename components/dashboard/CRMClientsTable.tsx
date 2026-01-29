'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Users, Check, X, Edit3, ChevronUp, ChevronDown, Trash2, Loader2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

// Customer interface matching Supabase schema
interface Customer {
  id: number;
  Status: string | null;
  Company: string | null;
  LastContact: string | null;
  Client: string | null;
  Contact: string | null;
}

const supabase = createClient();

export function CRMClientsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ customerId: number, field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [sortField, setSortField] = useState<string>('Client');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    Status: 'Lead',
    Company: '',
    Client: '',
    Contact: '',
    LastContact: new Date().toISOString().split('T')[0]
  });

  // Fetch customers from Supabase
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .order('id', { ascending: true });

      // If table doesn't exist or other error, just show empty state
      if (error) {
        console.log('Customer table may not exist:', error.message);
        setCustomers([]);
        return;
      }
      setCustomers(data || []);
    } catch (_err) {
      console.log('Using empty state for customers table');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Prospect': return 'text-blue-400';
      case 'Lead': return 'text-primary';
      case 'Churned': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusDot = (status: string | null) => {
    switch (status) {
      case 'Active': return 'bg-green-400';
      case 'Prospect': return 'bg-blue-400';
      case 'Lead': return 'bg-primary';
      case 'Churned': return 'bg-red-400';
      default: return 'bg-muted-foreground';
    }
  };

  const filteredAndSortedCustomers = customers
    .filter(customer =>
      (customer.Client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.Company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.Contact?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortField) {
        case 'Client':
          aValue = a.Client || '';
          bValue = b.Client || '';
          break;
        case 'Company':
          aValue = a.Company || '';
          bValue = b.Company || '';
          break;
        case 'Status':
          aValue = a.Status || '';
          bValue = b.Status || '';
          break;
        case 'LastContact':
          aValue = a.LastContact ? new Date(a.LastContact).getTime() : 0;
          bValue = b.LastContact ? new Date(b.LastContact).getTime() : 0;
          break;
        default:
          aValue = a.Client || '';
          bValue = b.Client || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });



  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const startEdit = (customerId: number, field: string, currentValue: string | null) => {
    setEditingCell({ customerId, field });
    setEditValue(currentValue || '');
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    try {
      const { error } = await supabase
        .from('customer')
        .update({ [editingCell.field]: editValue })
        .eq('id', editingCell.customerId);

      if (error) {
        console.log('Updating customer locally (table may not exist):', error.message);
      }

      // Always update local state
      setCustomers(customers.map(customer =>
        customer.id === editingCell.customerId
          ? { ...customer, [editingCell.field]: editValue }
          : customer
      ));
    } catch (_err) {
      console.log('Updating customer locally (error)');
      setCustomers(customers.map(customer =>
        customer.id === editingCell.customerId
          ? { ...customer, [editingCell.field]: editValue }
          : customer
      ));
    } finally {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const addNewCustomer = async () => {
    try {
      const { data, error } = await supabase
        .from('customer')
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.log('Adding customer locally (table may not exist):', error.message);
        const tempCustomer: Customer = {
          id: Date.now(),
          Client: newCustomer.Client || null,
          Contact: newCustomer.Contact || null,
          Company: newCustomer.Company || null,
          Status: newCustomer.Status || 'Lead',
          LastContact: newCustomer.LastContact || null
        };
        setCustomers([...customers, tempCustomer]);
      } else {
        setCustomers([...customers, data]);
      }

      setIsAddingNew(false);
      setNewCustomer({
        Status: 'Lead',
        Company: '',
        Client: '',
        Contact: '',
        LastContact: new Date().toISOString().split('T')[0]
      });
    } catch (_err) {
      console.log('Adding customer locally (error)');
      const tempCustomer: Customer = {
        id: Date.now(),
        Client: newCustomer.Client || null,
        Contact: newCustomer.Contact || null,
        Company: newCustomer.Company || null,
        Status: newCustomer.Status || 'Lead',
        LastContact: newCustomer.LastContact || null
      };
      setCustomers([...customers, tempCustomer]);
      setIsAddingNew(false);
      setNewCustomer({
        Status: 'Lead',
        Company: '',
        Client: '',
        Contact: '',
        LastContact: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('customer')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.log('Deleting customer locally (table may not exist):', deleteError.message);
      }

      // Always update local state
      setCustomers(customers.filter(c => c.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (_err) {
      console.log('Deleting customer locally (error)');
      setCustomers(customers.filter(c => c.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const deleteSelectedCustomers = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from('customer')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) {
        console.log('Deleting customers locally (table may not exist):', error.message);
      }

      // Always update local state
      setCustomers(customers.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    } catch (_err) {
      console.log('Deleting customers locally (error)');
      setCustomers(customers.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedCustomers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedCustomers.map(c => c.id)));
    }
  };

  const renderEditableCell = (
    customer: Customer,
    field: keyof Customer,
    value: string | null,
    className: string = ''
  ) => {
    const isEditing =
      editingCell?.customerId === customer.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          {field === 'Status' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            >
              <option value="Active">Active</option>
              <option value="Prospect">Prospect</option>
              <option value="Lead">Lead</option>
              <option value="Churned">Churned</option>
            </select>
          ) : field === 'LastContact' ? (
            <input
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border-2 border-primary rounded px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            />
          )}
          <button onClick={saveEdit} className="text-green-400 hover:text-green-300 p-1">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    }

    const displayValue = field === 'LastContact' ? formatDate(value) : (value || 'N/A');

    return (
      <div
        className={`group cursor-pointer hover:bg-card/20 rounded px-2 py-1 transition-colors flex items-center gap-2 ${className}`}
        onClick={() => startEdit(customer.id, field, value)}
      >
        <span className="font-mono text-foreground">{displayValue}</span>
        <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-mono text-sm">LOADING CUSTOMERS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-400 font-mono text-sm">ERROR: {error}</p>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

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
                {filteredAndSortedCustomers.length}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
            </div>

            <div className="flex items-center gap-3">
              {/* Delete Selected Button */}
              {selectedIds.size > 0 && (
                <button
                  onClick={deleteSelectedCustomers}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-mono transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE ({selectedIds.size})
                </button>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/70" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg text-sm font-mono text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                ADD CLIENT
              </button>
            </div>
          </div>
        </div>

        {/* Add New Customer Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-card-border/50 bg-primary/5"
            >
              <div className="p-4 grid grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={newCustomer.Client || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, Client: e.target.value })}
                  className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newCustomer.Company || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, Company: e.target.value })}
                  className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={newCustomer.Status || 'Lead'}
                  onChange={(e) => setNewCustomer({ ...newCustomer, Status: e.target.value })}
                  className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Lead">Lead</option>
                  <option value="Churned">Churned</option>
                </select>
                <input
                  type="text"
                  placeholder="Contact Info"
                  value={newCustomer.Contact || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, Contact: e.target.value })}
                  className="bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addNewCustomer}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-mono"
                  >
                    <Check className="w-4 h-4" />
                    SAVE
                  </button>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-mono"
                  >
                    <X className="w-4 h-4" />
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Container with Fixed Header */}
        <div className="relative max-h-[70vh] overflow-hidden border border-card-border/50 rounded-lg">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-20 bg-card/60 backdrop-blur-md border-b-2 border-primary/50 shadow-lg">
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] px-6 py-4 text-xs font-mono text-primary uppercase tracking-wider">
              {/* Select All Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredAndSortedCustomers.length && filteredAndSortedCustomers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-2 border-primary/50 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                />
              </div>
              <button
                onClick={() => handleSort('Client')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4"
              >
                CLIENT
                {sortField === 'Client' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('Company')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                COMPANY
                {sortField === 'Company' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('Status')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                STATUS
                {sortField === 'Status' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">CONTACT</div>
              <button
                onClick={() => handleSort('LastContact')}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors pl-4"
              >
                LAST CONTACT
                {sortField === 'LastContact' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            <AnimatePresence>
              {filteredAndSortedCustomers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-mono text-sm">NO CUSTOMERS FOUND</p>
                  <p className="text-muted-foreground/60 font-mono text-xs mt-2">Add your first customer to get started</p>
                </div>
              ) : (
                filteredAndSortedCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className={`grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] px-6 py-4 text-sm border-b border-card-border/30 transition-all duration-200 ${selectedIds.has(customer.id)
                      ? 'bg-primary/10'
                      : index % 2 === 0
                        ? 'bg-card/5 hover:bg-card/15'
                        : 'bg-card/10 hover:bg-card/20'
                      }`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(customer.id)}
                        onChange={() => toggleSelect(customer.id)}
                        className="w-4 h-4 rounded border-2 border-primary/50 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                      />
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-3 border-r border-card-border/50 pr-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0">
                        {customer.Client?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                      </div>
                      <div className="min-w-0 flex-1">
                        {renderEditableCell(customer, 'Client', customer.Client)}
                        <div className="text-xs font-mono text-muted-foreground">
                          #{customer.id.toString().padStart(3, '0')}
                        </div>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                      {renderEditableCell(customer, 'Company', customer.Company)}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 border-r border-card-border/50 pr-4 pl-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(customer.Status)} flex-shrink-0`} />
                      {renderEditableCell(customer, 'Status', customer.Status, `${getStatusColor(customer.Status)} text-xs uppercase`)}
                    </div>

                    {/* Contact */}
                    <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                      {renderEditableCell(customer, 'Contact', customer.Contact, 'text-xs')}
                    </div>

                    {/* Last Contact */}
                    <div className="flex items-center pl-4">
                      {renderEditableCell(customer, 'LastContact', customer.LastContact, 'text-muted-foreground')}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}